"use client";

import type { Monster } from "../types";

// Deduplicate a list of labels and return a stable, alphabetically sorted list.
// This keeps the filter options deterministic while staying data-driven.
function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values)).sort();
}

// Filter controls for search + size + race/element dropdowns.
// These are UI-only controls right now (wired to GET params for future use).
type MonsterFiltersProps = {
	monsters: Monster[];
	onResetTutorial?: () => void;
};

export default function MonsterFilters({
	monsters,
	onResetTutorial,
}: MonsterFiltersProps) {
	// Build option lists from the dataset so new monsters auto-appear in filters.
	const sizeOptions = uniqueSorted(
		monsters.map((monster) => monster.types?.size).filter(Boolean) as string[],
	);
	const raceOptions = uniqueSorted(
		monsters.map((monster) => monster.types?.race).filter(Boolean) as string[],
	);
	const elementOptions = uniqueSorted(
		monsters
			.map((monster) => monster.types?.element)
			.filter(Boolean) as string[],
	);

	return (
		// GET form matches legacy behavior while staying non-invasive.
		<form
			method="GET"
			className="flex items-center gap-3"
			id="searchForm"
			data-tour="monster-filters"
		>
			<div className="flex-1">
				<input
					type="text"
					name="search"
					className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
					placeholder="Search monster..."
					defaultValue=""
					aria-label="Search monsters"
				/>
			</div>

			<div className="flex-1">
				<select
					name="bodily"
					className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
					aria-label="Bodily"
				>
					<option value="">All Sizes</option>
					{sizeOptions.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>

			<div className="flex-1">
				<select
					name="rp"
					className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
					aria-label="Race Property"
				>
					<option value="">All Races &amp; Properties</option>
					{elementOptions.map((element) => (
						<option key={`element-${element}`} value={`element:${element}`}>
							Property: {element}
						</option>
					))}
					{raceOptions.map((race) => (
						<option key={`race-${race}`} value={`race:${race}`}>
							Race: {race}
						</option>
					))}
				</select>
			</div>

			<div className="flex min-w-60 items-center gap-2">
				<button
					type="reset"
					className="h-11 w-full rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
				>
					Reset
				</button>
				<button
					type="button"
					className="h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
					onClick={onResetTutorial}
				>
					Play tutorial
				</button>
			</div>
		</form>
	);
}
