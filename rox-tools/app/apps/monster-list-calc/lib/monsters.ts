import "server-only";

import { unstable_cache } from "next/cache";
import type { Monster } from "../types";
import { query } from "./db";

type MonsterRow = {
	name: string;
	level: number | null;
	location: string | null;
	description: string | null;
	image_url: string | null;
	stats: Monster["stats"] | null;
	stats_detailed: Monster["statsDetailed"] | null;
	exp: Monster["exp"] | null;
	burn: Monster["burn"] | null;
	types: Monster["types"] | null;
	loot_pool: Monster["lootPool"] | null;
};

// Convert raw DB rows into the app's Monster shape with safe defaults.
function mapMonsterRow(row: MonsterRow): Monster {
	return {
		name: row.name,
		level: row.level ?? 0,
		location: row.location ?? "",
		description: row.description ?? null,
		image: row.image_url ?? null,
		stats: row.stats ?? {},
		statsDetailed: row.stats_detailed ?? {},
		exp: row.exp ?? {},
		burn: row.burn ?? {},
		types: row.types ?? {},
		lootPool: row.loot_pool ?? {},
	};
}

// Shared select fields used by list/detail queries to keep payload mapping consistent.
const monsterSelectSql = `SELECT name,
		level,
		location,
		description,
		image_url,
		stats,
		stats_detailed,
		exp,
		burn,
		types,
		loot_pool
	 FROM monsters`;

// Cache the list query across requests for a short window to reduce DB pressure.
const getMonstersCached = unstable_cache(
	async (): Promise<Monster[]> => {
		const { rows } = await query<MonsterRow>(
			`${monsterSelectSql}
		 ORDER BY level NULLS LAST, name`,
		);

		return rows.map(mapMonsterRow);
	},
	["monster-list-calc:monsters:list"],
	{ revalidate: 60 },
);

export async function getMonsters(): Promise<Monster[]> {
	return getMonstersCached();
}

// Cache slug lookups too, so repeated detail visits avoid repeated SQL work.
const getMonsterBySlugCached = unstable_cache(
	async (slug: string): Promise<Monster | null> => {
		const normalizedSlug = slug.trim().toLowerCase();
		if (!normalizedSlug) return null;

		const { rows } = await query<MonsterRow>(
			`${monsterSelectSql}
			 WHERE regexp_replace(
				replace(replace(lower(trim(name)), '''', ''), '’', ''),
				'\\s+',
				'-',
				'g'
			 ) = $1
			 LIMIT 1`,
			[normalizedSlug],
		);

		const row = rows[0];
		return row ? mapMonsterRow(row) : null;
	},
	["monster-list-calc:monsters:by-slug"],
	{ revalidate: 60 },
);

export async function getMonsterBySlug(slug: string): Promise<Monster | null> {
	return getMonsterBySlugCached(slug);
}
