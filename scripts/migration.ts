import { DataBaseConnection } from "../src/db/index.ts";

const MIGRATIONS_DIR = "./migrations";
const [cmd, ...rest] = Deno.args;

function fail(msg: string): never {
  console.error(`%c✗ ${msg}`, "color: red");
  Deno.exit(1);
}

async function withDataSource(fn: () => Promise<void>) {
  await DataBaseConnection.initialize();
  try {
    await fn();
  } finally {
    await DataBaseConnection.destroy();
  }
}

async function create() {
  let rawName = rest[0]?.trim();
  if (!rawName) rawName = prompt("Migration name:")?.trim() ?? "";
  if (!rawName) fail("no name given");

  const name = rawName
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  if (!name) {
    fail(`invalid name "${rawName}" — use alphanumeric characters, spaces, or hyphens`);
  }

  await Deno.mkdir(MIGRATIONS_DIR, { recursive: true });

  const { code } = await new Deno.Command("deno", {
    args: [
      "run", "-A", "npm:typeorm@0.3",
      "migration:create", `${MIGRATIONS_DIR}/${name}`,
    ],
    stdout: "inherit",
    stderr: "inherit",
  }).output();

  if (code !== 0) fail("typeorm CLI exited non-zero");
}

async function run() {
  await withDataSource(async () => {
    const applied = await DataBaseConnection.runMigrations({ transaction: "each" });
    if (!applied.length) console.log("nothing pending");
    for (const m of applied) console.log(`↑ ${m.name}`);
  });
}

async function revert() {
  const steps = Number(rest[0] ?? 1);
  if (!Number.isInteger(steps) || steps < 1) fail("steps must be a positive integer");
  await withDataSource(async () => {
    for (let i = 0; i < steps; i++) await DataBaseConnection.undoLastMigration();
    console.log(`↓ reverted ${steps}`);
  });
}

async function show() {
  await withDataSource(async () => {
    const pending = await DataBaseConnection.showMigrations();
    console.log(pending ? "pending migrations exist" : "up to date");
  });
}

const commands: Record<string, () => Promise<void>> = {
  create, run, revert, show,
};

const handler = commands[cmd];
if (!handler) fail(`usage: migration.ts <${Object.keys(commands).join("|")}>`);
await handler();