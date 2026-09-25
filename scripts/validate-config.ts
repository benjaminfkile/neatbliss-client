import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { configSchema } from "../src/config/schema.js";

const configPath = resolve(process.cwd(), "public/config.json");

function fail(message: string): never {
  process.stderr.write(`config.json is invalid: ${message}\n`);
  process.exit(1);
}

let raw: string;
try {
  raw = readFileSync(configPath, "utf8");
} catch (err) {
  const detail = err instanceof Error ? err.message : String(err);
  fail(`could not read public/config.json (${detail})`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  const detail = err instanceof Error ? err.message : String(err);
  fail(`JSON parse error (${detail})`);
}

const result = configSchema.safeParse(parsed);
if (!result.success) {
  const first = result.error.issues[0];
  const path = first.path.length > 0 ? first.path.join(".") : "(root)";
  fail(`${path}: ${first.message}`);
}

process.stdout.write("config.json is valid\n");
