"use client";

import { useMemo, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { levels, partySizeOptions, uniqueClassOptions } from "../constants";
import { monsterSlug } from "../monsterSlug";
import type { Monster } from "../types";
import MonsterInfoCard from "./MonsterInfoCard";

type ScoredMonster = {
	monster: Monster;
	baseScore: number;
	jobScore: number;
	odinBaseScore: number;
	odinJobScore: number;
};

type CategoryCard = {
	key: "afk-base" | "afk-job" | "odin-base" | "odin-job";
	entry: ScoredMonster | null;
};

function toPartyCount(value: string): number {
	const parsed = Number(value.replace("c", ""));
	return Number.isFinite(parsed) && parsed > 0 ? Math.min(5, parsed) : 1;
}

function monsterLevelMultiplier(
	charLevel: number,
	monsterLevel: number,
): number {
	const delta = Math.abs(monsterLevel - charLevel);
	if (delta <= 3) return 1;
	const outsideRange = delta - 3;
	return Math.max(0, 1 - outsideRange * 0.1);
}

function worldLevelMultiplier(charLevel: number, worldLevel: number): number {
	const worldDelta = worldLevel - charLevel;
	if (worldDelta < 0) {
		return Math.max(0, 1 + worldDelta * 0.1);
	}
	if (worldDelta > 0 && charLevel > 35) {
		return 1 + worldDelta * 0.1;
	}
	return 1;
}

function groupMultiplier(
	partySize: string,
	uniqueClasses: number,
	partyCount: number,
): number {
	const partyBonus = partyCount * 0.05;
	const classBonus = uniqueClasses * 0.05;
	const partnerBonus = partySize.endsWith("c") ? 0.05 : 0;
	return 1 + partyBonus + classBonus + partnerBonus;
}

function pickBest(
	entries: ScoredMonster[],
	scoreGetter: (entry: ScoredMonster) => number,
): ScoredMonster | null {
	if (entries.length === 0) return null;
	return entries.reduce((best, current) =>
		scoreGetter(current) > scoreGetter(best) ? current : best,
	);
}

export default function MonsterCalculatorModal({
	monsters,
}: {
	monsters: Monster[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [charLevel, setCharLevel] = useState(1);
	const [worldLevel, setWorldLevel] = useState(1);
	const [partySize, setPartySize] = useState("1");
	const [uniqueClasses, setUniqueClasses] = useState(1);
	const [hasTouchedCoreInput, setHasTouchedCoreInput] = useState(false);

	const firstMonster = monsters[0] ?? null;

	const scoredMonsters = useMemo<ScoredMonster[]>(() => {
		if (!hasTouchedCoreInput) {
			return [];
		}

		const partyCount = toPartyCount(partySize);
		const modifier =
			worldLevelMultiplier(charLevel, worldLevel) *
			groupMultiplier(partySize, uniqueClasses, partyCount);

		return monsters
			.map((monster) => {
				const base = monster.exp?.solo?.base ?? 0;
				const job = monster.exp?.solo?.job ?? 0;
				if (base <= 0 && job <= 0) return null;

				const levelMod = monsterLevelMultiplier(charLevel, monster.level);
				const finalModifier = modifier * levelMod;

				const baseScore = base * finalModifier;
				const jobScore = job * finalModifier;

				return {
					monster,
					baseScore,
					jobScore,
					odinBaseScore: baseScore * 5,
					odinJobScore: jobScore * 5,
				};
			})
			.filter((entry): entry is ScoredMonster => entry !== null);
	}, [
		hasTouchedCoreInput,
		monsters,
		partySize,
		uniqueClasses,
		charLevel,
		worldLevel,
	]);

	const cards = useMemo<CategoryCard[]>(() => {
		if (!hasTouchedCoreInput && firstMonster) {
			const placeholder: ScoredMonster = {
				monster: firstMonster,
				baseScore: 0,
				jobScore: 0,
				odinBaseScore: 0,
				odinJobScore: 0,
			};
			return [
				{ key: "afk-base", entry: placeholder },
				{ key: "afk-job", entry: placeholder },
				{ key: "odin-base", entry: placeholder },
				{ key: "odin-job", entry: placeholder },
			];
		}

		const bestAfkBase = pickBest(scoredMonsters, (entry) => entry.baseScore);
		const bestAfkJob = pickBest(scoredMonsters, (entry) => entry.jobScore);
		const bestOdinBase = pickBest(
			scoredMonsters,
			(entry) => entry.odinBaseScore,
		);
		const bestOdinJob = pickBest(scoredMonsters, (entry) => entry.odinJobScore);

		return [
			{ key: "afk-base", entry: bestAfkBase },
			{ key: "afk-job", entry: bestAfkJob },
			{ key: "odin-base", entry: bestOdinBase },
			{ key: "odin-job", entry: bestOdinJob },
		];
	}, [hasTouchedCoreInput, firstMonster, scoredMonsters]);

	return (
		<>
			<button
				type="button"
				className="fixed bottom-6 right-6 z-40 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold shadow-md hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				onClick={() => setIsOpen(true)}
				aria-label="Open EXP calculator"
			>
				Best EXP
			</button>

			<BaseModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title="Monsterpedia EXP Calculator"
				size="xl"
			>
				<div className="grid gap-3 lg:grid-cols-4 lg:items-end">
					<div>
						<label
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="calc-char-level"
						>
							Your Level
						</label>
						<select
							id="calc-char-level"
							className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
							value={charLevel}
							onChange={(e) => {
								setHasTouchedCoreInput(true);
								setCharLevel(Number(e.target.value));
							}}
						>
							{levels.map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="calc-world-level"
						>
							World Level
						</label>
						<select
							id="calc-world-level"
							className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
							value={worldLevel}
							onChange={(e) => {
								setHasTouchedCoreInput(true);
								setWorldLevel(Number(e.target.value));
							}}
						>
							{levels.map((level) => (
								<option key={level} value={level}>
									{level}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="calc-party-size"
						>
							Party Size
						</label>
						<select
							id="calc-party-size"
							className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
							value={partySize}
							onChange={(e) => setPartySize(e.target.value)}
						>
							{partySizeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="calc-unique-classes"
						>
							Unique Classes
						</label>
						<select
							id="calc-unique-classes"
							className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
							value={uniqueClasses}
							onChange={(e) => setUniqueClasses(Number(e.target.value))}
						>
							{uniqueClassOptions.map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
					{cards.map((card) => {
						const entry = card.entry;
						if (!entry) {
							return (
								<div
									key={card.key}
									className="rounded-xl border border-black/10 bg-white p-4 text-sm shadow-sm dark:border-white/15 dark:bg-black"
								>
									<div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
										No monster data available.
									</div>
								</div>
							);
						}

						const isJobBest = card.key.includes("job");
						const isOdinBest = card.key.includes("odin");
						const displayBaseExp = Math.round(
							isOdinBest ? entry.odinBaseScore : entry.baseScore,
						);
						const displayJobExp = Math.round(
							isOdinBest ? entry.odinJobScore : entry.jobScore,
						);

						return (
							<MonsterInfoCard
								key={card.key}
								monster={entry.monster}
								href={
									"/apps/monster-list-calc/" + monsterSlug(entry.monster.name)
								}
								className="rounded-xl border border-black/10 bg-white p-4 text-sm shadow-sm transition-shadow hover:shadow-lg dark:border-white/15 dark:bg-black"
								variant="split"
								capitalizeName
								locationWithPin
								renderFooter={() => (
									<div className="mt-3 py-2">
										<div className="inline-flex items-center gap-6 text-base font-semibold">
											<span className="inline-flex items-center gap-2">
												<span className="font-bold text-zinc-700 dark:text-zinc-200">
													Base exp:
												</span>
												<span
													className={
														isJobBest
															? "font-bold text-zinc-600 dark:text-zinc-300"
															: "font-bold text-blue-600 dark:text-blue-400"
													}
												>
													{displayBaseExp}
												</span>
											</span>

											<span className="inline-flex items-center gap-2">
												<span className="font-bold text-zinc-700 dark:text-zinc-200">
													Job exp:
												</span>
												<span
													className={
														isJobBest
															? "font-bold text-emerald-600 dark:text-emerald-400"
															: "font-bold text-zinc-600 dark:text-zinc-300"
													}
												>
													{displayJobExp}
												</span>
											</span>
										</div>
									</div>
								)}
							/>
						);
					})}
				</div>
			</BaseModal>
		</>
	);
}
