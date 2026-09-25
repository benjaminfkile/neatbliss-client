import { useEffect } from "react";

export function AdminPage() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <main className="container" style={{ padding: "48px 20px" }}>
      <h1>NeatBliss site settings</h1>
    </main>
  );
}
