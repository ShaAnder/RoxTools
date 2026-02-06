import "server-only";

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

export async function getMonsters(): Promise<Monster[]> {
	const { rows } = await query<MonsterRow>(
		`SELECT name,
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
		 FROM monsters
		 ORDER BY level NULLS LAST, name`
	);

	return rows.map((row) => ({
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
	}));
}
