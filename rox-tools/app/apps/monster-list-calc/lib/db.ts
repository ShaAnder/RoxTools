import "server-only";

import { Pool } from "pg";

declare global {
	// eslint-disable-next-line no-var
	var __monsterDbPool: Pool | undefined;
}

const connectionString =
	process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
	throw new Error("Missing POSTGRES_URL or DATABASE_URL");
}

const pool = global.__monsterDbPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
	global.__monsterDbPool = pool;
}

export async function query<T>(text: string, params?: unknown[]) {
	return pool.query<T>(text, params);
}
