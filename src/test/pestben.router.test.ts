import { assertEquals } from "@std/assert";
import { useFakeDb } from "./pg_mem.ts";
import createApp from "../app.ts";
import { closeDatabase } from "../db/index.ts";

function startApp() {
  const server = createApp().listen(0);
  const { port } = server.address() as { port: number };
  return { base: `http://localhost:${port}`, close: () => server.close() };
}

Deno.test("GET /pestben/get-slug — no DB needed", async () => {
  const { base, close } = startApp();
  const res = await fetch(`${base}/pestben/get-slug`);
  const body = await res.json();
  assertEquals(res.status, 200);
  assertEquals(body.slug.length, 16);
  close();
});

Deno.test("POST /pestben/save creates, then GET /pestben/fetch returns it", async () => {
  await useFakeDb();
  const { base, close } = startApp();
  const identifier = "abcdefghijklmnop";

  const created = await fetch(`${base}/pestben/save`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier, bio: "hello world" }),
  });
  const createdBody = await created.json();
  assertEquals(created.status, 201);
  assertEquals(createdBody.content.bio, "hello world");

  const fetched = await fetch(`${base}/pestben/fetch/${identifier}`);
  const body = await fetched.json();
  assertEquals(fetched.status, 200);
  assertEquals(body.content.bio, "hello world");

  close();
  await closeDatabase();
});

Deno.test("GET /pestben/fetch/:identifier — 404 when missing", async () => {
  await useFakeDb();
  const { base, close } = startApp();
  const res = await fetch(`${base}/pestben/fetch/doesnotexist12345`);
  await res.body?.cancel();
  assertEquals(res.status, 404);
  close();
  await closeDatabase();
});

Deno.test("POST /pestben/save — 400 when identifier too short", async () => {
  const { base, close } = startApp();
  const res = await fetch(`${base}/pestben/save`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ identifier: "short", bio: "x" }),
  });
  await res.body?.cancel();
  assertEquals(res.status, 400);
  close();
});
