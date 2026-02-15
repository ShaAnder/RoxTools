import { levels, partySizeOptions, uniqueClassOptions } from "../constants";

// Static calculator UI shell. The actual EXP math will be wired later.
// Keeping this separate makes it easy to evolve without touching the page layout.
export default function MonsterCalculator() {
	return (
		<div
			className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-black"
			data-tour="monster-calculator"
		>
			<h5 className="text-xl font-semibold tracking-tight">
				Monsterpedia & EXP Calculator
			</h5>
			<div className="mt-4 grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
				<div>
					{/* Character level uses a looped list to avoid 160 hard-coded options. */}
					<label
						className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						htmlFor="charLevel"
					>
						Your Level
					</label>
					<select
						id="charLevel"
						className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
						defaultValue="1"
					>
						{levels.map((level) => (
							<option key={level} value={level}>
								{level}
							</option>
						))}
					</select>
				</div>

				<div>
					{/* Party size includes couple EXP variants from constants. */}
					<label
						className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						htmlFor="partySize"
					>
						Party Size
					</label>
					<select
						id="partySize"
						className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
						defaultValue="1"
					>
						{partySizeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div>
					{/* Unique class count affects bonus logic in future calculations. */}
					<label
						className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						htmlFor="uniqueClasses"
					>
						Unique Classes
					</label>
					<select
						id="uniqueClasses"
						className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
						defaultValue="1"
					>
						{uniqueClassOptions.map((value) => (
							<option key={value} value={value}>
								{value}
							</option>
						))}
					</select>
				</div>

				<div>
					{/* World level is separate from character level for scaling rules. */}
					<label
						className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						htmlFor="worldLevel"
					>
						World Level
					</label>
					<select
						id="worldLevel"
						className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
						defaultValue="150"
					>
						{levels.map((level) => (
							<option key={level} value={level}>
								{level}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-3 self-center">
					<label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
						<input
							className="h-4 w-4 rounded border-black/20 text-blue-600 dark:border-white/20"
							type="checkbox"
							id="useOdin"
						/>
						<span>Use 5x EXP (Odin)</span>
					</label>

					<label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
						<input
							className="h-4 w-4 rounded border-black/20 text-blue-600 dark:border-white/20"
							type="checkbox"
							id="exactAbove50"
						/>
						<span>Base EXP &gt; 50%</span>
					</label>
				</div>
			</div>
		</div>
	);
}
