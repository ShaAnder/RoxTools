"use client";

import type { Monster } from "../types";

// Keep dropdown options stable and deterministic for consistent UI ordering.
function uniqueSorted(values: string[]): string[] {
	return Array.from(new Set(values)).sort();
}

// Filter toolbar for search + size + property + race.
type MonsterFiltersProps = {
	monsters: Monster[];
	searchTerm: string;
	onSearchChange: (value: string) => void;
	sizeFilter: string;
	onSizeChange: (value: string) => void;
	propertyFilter: string;
	onPropertyChange: (value: string) => void;
	raceFilter: string;
	onRaceChange: (value: string) => void;
	onResetFilters: () => void;
	onResetTutorial?: () => void;
};

const fieldClass =
	"h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black";
const secondaryButtonClass =
	"h-11 w-full rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10";
const primaryButtonClass =
	"h-11 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5";

export default function MonsterFilters({
	monsters,
	searchTerm,
	onSearchChange,
	sizeFilter,
	onSizeChange,
	propertyFilter,
	onPropertyChange,
	raceFilter,
	onRaceChange,
	onResetFilters,
	onResetTutorial,
}: MonsterFiltersProps) {
	// Build options from live data so the filter UI stays future-proof.
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
		// Keep form semantics for accessibility while handling filtering client-side.
		<form
			method="GET"
			className="flex flex-wrap items-center gap-3"
			id="searchForm"
			data-tour="monster-filters"
			onSubmit={(e) => e.preventDefault()}
		>
			<div className="min-w-56 flex-1">
				<input
					type="text"
					name="search"
					className={fieldClass}
					placeholder="Search monster..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					aria-label="Search monsters"
				/>
			</div>

			<div className="min-w-40 flex-1">
				<select
					name="bodily"
					className={fieldClass}
					aria-label="Bodily"
					value={sizeFilter}
					onChange={(e) => onSizeChange(e.target.value)}
				>
					<option value="">All Sizes</option>
					{sizeOptions.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>

			<div className="min-w-40 flex-1">
				<select
					name="property"
					className={fieldClass}
					aria-label="Property"
					value={propertyFilter}
					onChange={(e) => onPropertyChange(e.target.value)}
				>
					<option value="">All Properties</option>
					{elementOptions.map((element) => (
						<option key={`element-${element}`} value={element}>
							{element}
						</option>
					))}
				</select>
			</div>

			<div className="min-w-40 flex-1">
				<select
					name="race"
					className={fieldClass}
					aria-label="Race"
					value={raceFilter}
					onChange={(e) => onRaceChange(e.target.value)}
				>
					<option value="">All Races</option>
					{raceOptions.map((race) => (
						<option key={`race-${race}`} value={race}>
							{race}
						</option>
					))}
				</select>
			</div>

			<div className="flex w-full items-center justify-center gap-2 sm:ml-auto sm:w-auto sm:min-w-60 sm:justify-end">
				<button
					type="button"
					className={secondaryButtonClass}
					onClick={onResetFilters}
				>
					Reset
				</button>
				<button
					type="button"
					className={primaryButtonClass}
					onClick={onResetTutorial}
				>
					Play tutorial
				</button>
			</div>
		</form>
	);
}
