import { promises as fs } from "fs";
import path from "path";

/**
 * Simple JSON-file backed storage for local / self-hosted deployments.
 *
 * NOTE: This persists to a `data/` folder on the server's filesystem.
 * It works great for a single VPS / local server. On ephemeral/serverless
 * hosts (e.g. Vercel) the filesystem is read-only, so swap this for a real
 * database (Postgres, MongoDB, Supabase, etc.) when you scale.
 */

const dataDir = path.join(process.cwd(), "data");

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readCollection<T>(name: string): Promise<T[]> {
  await ensureDir();
  const file = path.join(dataDir, `${name}.json`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function appendToCollection<T extends Record<string, unknown>>(
  name: string,
  record: T
): Promise<T> {
  await ensureDir();
  const file = path.join(dataDir, `${name}.json`);
  const items = await readCollection<T>(name);
  items.push(record);
  await fs.writeFile(file, JSON.stringify(items, null, 2), "utf-8");
  return record;
}

export function generateId(prefix: string) {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${stamp}${rand}`.toUpperCase();
}
