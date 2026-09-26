import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { createConnection } from "node:net";

const PORT = Number(process.env.E2E_PORT ?? 4173);
const HOST = "127.0.0.1";
const useShell = process.platform === "win32";

function log(message: string): void {
  process.stdout.write(`[e2e] ${message}\n`);
}

function waitForPort(port: number, host: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = createConnection({ port, host });
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`server did not start on ${host}:${port}`));
          return;
        }
        setTimeout(attempt, 250);
      });
    };
    attempt();
  });
}

async function main(): Promise<void> {
  log("building app");
  const build = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    shell: useShell,
    env: { ...process.env, VITE_BASE: "/" },
  });
  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }

  log(`starting vite preview on ${HOST}:${PORT}`);
  const preview: ChildProcess = spawn(
    "npx",
    ["vite", "preview", "--host", HOST, "--port", String(PORT), "--strictPort"],
    { stdio: "inherit", shell: useShell },
  );

  const cleanup = () => {
    if (preview.killed) {
      return;
    }
    if (useShell && preview.pid) {
      // On Windows the child is a shell wrapper; kill the whole tree so the
      // preview server does not outlive this script.
      spawnSync("taskkill", ["/pid", String(preview.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      preview.kill("SIGTERM");
    }
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(143);
  });

  try {
    await waitForPort(PORT, HOST, 30_000);
  } catch (err) {
    cleanup();
    const detail = err instanceof Error ? err.message : String(err);
    log(`server never became ready: ${detail}`);
    process.exit(1);
  }

  log("running Playwright");
  const tests = spawnSync("npx", ["playwright", "test"], {
    stdio: "inherit",
    shell: useShell,
    env: { ...process.env, E2E_PORT: String(PORT) },
  });

  cleanup();

  const code = tests.status ?? 1;
  process.exit(code);
}

main().catch((err) => {
  const detail = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`[e2e] fatal: ${detail}\n`);
  process.exit(1);
});
