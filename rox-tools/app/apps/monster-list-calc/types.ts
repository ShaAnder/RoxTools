// Canonical shape for monster data loaded from the database.
// This type is shared across page and UI components for consistency.
export type Monster = {
	name: string;
	level: number;
	location: string;
	description?: string | null;
	image: string | null;
	stats: {
		hp?: number;
		atk?: number;
		pDef?: number;
		mDef?: number;
		hit?: number;
		dodge?: number;
		crit?: number;
		aspd?: number;
	};
	statsDetailed: {
		maxHp?: number;
		pDefPct?: number;
		pDefFinal?: number;
		mDefPct?: number;
		mDefFinal?: number;
		antiCritPct?: number;
		antiCritFinal?: number;
		fleePct?: number;
		fleeFinal?: number;
		pAtk?: number;
		mAtk?: number;
		pPenPct?: number;
		pPenFinal?: number;
		mPenPct?: number;
		mPenFinal?: number;
		critPct?: number;
		critFinal?: number;
		hitPct?: number;
		hitFinal?: number;
	};
	exp: {
		solo?: { base?: number; job?: number };
		odin?: { base?: number; job?: number };
	};
	burn: {
		odin?: string | number | null;
		afkWithoutOdin?: string | number | null;
	};
	types: {
		atkType?: string;
		size?: string;
		race?: string;
		element?: string;
	};
	lootPool: {
		zeny?: number;
		card?: {
			chancePct?: number;
			type?: string;
			effect?: string;
		} | null;
		items?: Record<string, unknown>;
	};
};
