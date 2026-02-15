import "server-only";

import { Pool, type QueryResultRow } from "pg";

// Reuse a single pool during local development hot reloads.
declare global {
	var __monsterDbPool: Pool | undefined;
}

const connectionString =
	process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!connectionString) {
	throw new Error("Missing POSTGRES_URL or DATABASE_URL");
}

// Normalize legacy SSL query params so newer pg versions avoid alias warnings.
function normalizeSslMode(value: string): string {
	const parsed = new URL(value);
	const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
	const useLibpqCompat =
		parsed.searchParams.get("uselibpqcompat")?.toLowerCase() === "true";

	if (useLibpqCompat) {
		return value;
	}

	if (sslMode && ["prefer", "require", "verify-ca"].includes(sslMode)) {
		parsed.searchParams.set("sslmode", "verify-full");
		return parsed.toString();
	}

	return value;
}

const normalizedConnectionString = normalizeSslMode(connectionString);
const pool =
	global.__monsterDbPool ??
	new Pool({ connectionString: normalizedConnectionString });

if (process.env.NODE_ENV !== "production") {
	global.__monsterDbPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
	text: string,
	params?: unknown[],
) {
	return pool.query<T>(text, params);
}
