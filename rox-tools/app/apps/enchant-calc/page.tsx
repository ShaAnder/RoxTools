"use client";

import EnchantTour from "./EnchantTour";
import { useMemo, useState } from "react";

type EnchantType = "wep" | "armor" | "acc";

const plantNames: Record<EnchantType, Record<string, string>> = {
	wep: {
		izlude: "Shattering Shroom",
		morroc: "Gold Flower",
		alberta: "Water Seeking Flower",
		payon: "Grim Grass",
		geffen: "Moonflower",
	},
	armor: {
		izlude: "Tough Vine",
		morroc: "Scorched Mushroom",
		alberta: "Sea Gem Grass",
		payon: "Ochre Seedling",
		geffen: "Praying Flower",
	},
	acc: {
		izlude: "Arcane Flower",
		morroc: "Withered Chastetree",
		alberta: "Firefly Grass",
		payon: "Quiet Flower",
		geffen: "Crystal Rose",
	},
};

const reqExp = [
	0, 10, 30, 60, 100, 150, 250, 400, 600, 850, 1150, 1550, 2050, 2800, 3800,
	5050, 6650, 8300, 10300, 12550,
];

const locationsData = [
	{
		name: "Prontera",
		muspeLvl: 1,
		muspeNum: 30,
		plantNum: 0,
		tapsPerExp: 1,
	},
	{ name: "Izlude", muspeLvl: 1, muspeNum: 5, plantNum: 1, tapsPerExp: 1 },
	{ name: "Morroc", muspeLvl: 2, muspeNum: 8, plantNum: 1, tapsPerExp: 0.5 },
	{ name: "Alberta", muspeLvl: 3, muspeNum: 6, plantNum: 3, tapsPerExp: 0.25 },
	{ name: "Payon", muspeLvl: 4, muspeNum: 8, plantNum: 4, tapsPerExp: 0.125 },
	{
		name: "Geffen",
		muspeLvl: 4,
		muspeNum: 18,
		plantNum: 7,
		tapsPerExp: 0.0625,
	},
];

type Row = {
	location: string;
	costPerTap: number;
	costTillNextLevel: string;
	craftable?: boolean;
	tapsNeeded?: string;
	savings?: string;
	staminaPerTap: string;
	totalStaminaUsage: string;
};

function numberOrZero(value: string): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function isProvided(value: string): boolean {
	return value.trim().length > 0;
}

function fmtWholeIfNoDecimals(value: string | number): string {
	const text = typeof value === "number" ? value.toFixed(2) : String(value);
	if (/^-?\d+\.00$/.test(text)) return text.slice(0, -3);
	return text;
}

function stonesPerTap(location: string): number {
	// Per spec: Izlude and onward uses 2 stones per tap.
	return location.toLowerCase() === "prontera" ? 1 : 2;
}

const tierSkillReq: Record<number, number> = {
	1: 1,
	2: 3,
	3: 5,
	4: 7,
};

function getSmithingReq(location: string, muspeLvl: number): number {
	if (location.toLowerCase() === "geffen") return 8;
	return tierSkillReq[muspeLvl] ?? 0;
}

export default function EnchantCalcPage() {
	const [enchantType, setEnchantType] = useState<EnchantType>("wep");
	const [tourNonce, setTourNonce] = useState(0);

	const [muspe1, setMuspe1] = useState("0");
	const [muspe2, setMuspe2] = useState("0");
	const [muspe3, setMuspe3] = useState("0");
	const [muspe4, setMuspe4] = useState("0");

	const [plantIzlude, setPlantIzlude] = useState("0");
	const [plantMorroc, setPlantMorroc] = useState("0");
	const [plantAlberta, setPlantAlberta] = useState("0");
	const [plantPayon, setPlantPayon] = useState("0");
	const [plantGeffen, setPlantGeffen] = useState("0");

	const [currentLevel, setCurrentLevel] = useState("1");
	const [currentExp, setCurrentExp] = useState("");

	const [smithingLevel, setSmithingLevel] = useState("");
	const [gatherPlants, setGatherPlants] = useState(false);

	function handleEnchantTypeChange(next: EnchantType) {
		setEnchantType(next);
		setPlantAlberta("0");
		setPlantPayon("0");
		setPlantGeffen("0");
		setCurrentExp("");
		setGatherPlants(false);
	}

	const currentPlants = useMemo(() => plantNames[enchantType], [enchantType]);

	const { rows, showEstimate, nextLevel } = useMemo(() => {
		const muspePrices: Record<number, number> = {
			1: numberOrZero(muspe1),
			2: numberOrZero(muspe2),
			3: numberOrZero(muspe3),
			4: numberOrZero(muspe4),
		};

		const plantPrices: Record<string, number> = {
			izlude: numberOrZero(plantIzlude),
			morroc: numberOrZero(plantMorroc),
			alberta: numberOrZero(plantAlberta),
			payon: numberOrZero(plantPayon),
			geffen: numberOrZero(plantGeffen),
		};

		const hasAnyMaterialPrice =
			Object.values(muspePrices).some((price) => price > 0) ||
			Object.values(plantPrices).some((price) => price > 0);

		const level = Math.min(19, Math.max(1, Number(currentLevel) || 1));
		const computedNextLevel = Math.min(20, level + 1);
		const exp = isProvided(currentExp)
			? Math.max(0, Number(currentExp) || 0)
			: 0;
		const required = reqExp[level] ?? 0;
		const remainingExp = Math.max(0, required - exp);
		const shouldShowEstimate = isProvided(currentExp) && remainingExp > 0;

		const hasSmithing = isProvided(smithingLevel);
		const smithing = numberOrZero(smithingLevel);
		const shouldGate = hasSmithing;

		const computedRows: Row[] = locationsData.map((loc) => {
			const muspePrice = muspePrices[loc.muspeLvl] ?? 0;
			const key = loc.name.toLowerCase();
			const plantPrice = key === "prontera" ? 0 : (plantPrices[key] ?? 0);
			const stones = stonesPerTap(loc.name);
			const muspePerTap = loc.muspeNum * stones;
			const plantsPerTap = loc.plantNum * stones;

			const costPerTap = muspePerTap * muspePrice + plantsPerTap * plantPrice;
			const tapsNeededNum = Math.ceil(remainingExp * loc.tapsPerExp);
			const savingsNum = tapsNeededNum * plantsPerTap * plantPrice;
			const effectiveCostPerTap = gatherPlants
				? muspePerTap * muspePrice
				: costPerTap;
			const costTillNextLevel = (tapsNeededNum * effectiveCostPerTap).toFixed(
				2,
			);
			const craftingStaminaPerTap = stones * 10;
			const gatheringStaminaPerTap = gatherPlants ? plantsPerTap * 10 : 0;
			const staminaPerTapNum = craftingStaminaPerTap + gatheringStaminaPerTap;
			const staminaPerTap =
				key === "prontera"
					? "-"
					: hasAnyMaterialPrice || gatherPlants
						? String(staminaPerTapNum)
						: "0";
			const totalStaminaUsage =
				key === "prontera"
					? "-"
					: hasAnyMaterialPrice || gatherPlants
						? String(tapsNeededNum * staminaPerTapNum)
						: "0";

			let craftable: boolean | undefined = undefined;
			if (shouldGate) {
				const smithingReq = getSmithingReq(loc.name, loc.muspeLvl);
				craftable = smithing >= smithingReq;
			}

			if (!shouldShowEstimate) {
				return {
					location: loc.name,
					costPerTap,
					costTillNextLevel,
					craftable,
					staminaPerTap,
					totalStaminaUsage,
				};
			}

			const savings = savingsNum.toFixed(2);

			return {
				location: loc.name,
				costPerTap,
				costTillNextLevel,
				craftable,
				tapsNeeded: String(tapsNeededNum),
				savings,
				staminaPerTap,
				totalStaminaUsage,
			};
		});

		return {
			rows: computedRows,
			showEstimate: shouldShowEstimate,
			nextLevel: computedNextLevel,
		};
	}, [
		currentExp,
		currentLevel,
		gatherPlants,
		muspe1,
		muspe2,
		muspe3,
		muspe4,
		plantAlberta,
		plantGeffen,
		plantIzlude,
		plantMorroc,
		plantPayon,
		smithingLevel,
	]);

	return (
		<div className="flex h-full flex-col gap-4 md:overflow-hidden">
			<EnchantTour key={tourNonce} />
			<div className="flex items-start justify-between gap-3">
				<h1 className="text-2xl font-semibold tracking-tight">
					ROX Global Enchantment Cost Calculator
				</h1>
				<button
					type="button"
					className="shrink-0 rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
					onClick={() => {
						try {
							localStorage.removeItem("rox-tools.enchant-calc.tour.v1.seen");
						} catch {
							// ignore
						}
						window.scrollTo({ top: 0, behavior: "smooth" });
						setTourNonce((n) => n + 1);
					}}
				>
					Play tutorial
				</button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-4 md:overflow-hidden">
				<section className="flex-none">
					<div className="grid gap-4 md:grid-cols-3">
						<div
							data-tour="basics"
							className="space-y-4 rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black"
						>
							<div className="space-y-2">
								<div className="text-sm font-semibold tracking-tight">
									Basics
								</div>
								<label
									className="block text-sm font-medium"
									htmlFor="enchantType"
								>
									Enchantment Type
								</label>
								<select
									id="enchantType"
									value={enchantType}
									onChange={(e) =>
										handleEnchantTypeChange(e.target.value as EnchantType)
									}
									className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
								>
									<option value="wep">Weapon</option>
									<option value="armor">Armor</option>
									<option value="acc">Accessory</option>
								</select>
							</div>

							<div className="space-y-2">
								<div className="text-sm font-medium">Smithing (Optional)</div>
								<div className="grid grid-cols-1 gap-3">
									<input
										type="number"
										min={0}
										inputMode="numeric"
										value={smithingLevel}
										onChange={(e) => setSmithingLevel(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<label
									className="block text-sm font-medium"
									htmlFor="currentLevel"
								>
									Current Enchant Level (Optional)
								</label>
								<div className="grid grid-cols-2 gap-3">
									<select
										id="currentLevel"
										value={currentLevel}
										onChange={(e) => setCurrentLevel(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									>
										{Array.from({ length: 19 }, (_, i) => String(i + 1)).map(
											(lvl) => (
												<option key={lvl} value={lvl}>
													{lvl}
												</option>
											),
										)}
									</select>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={currentExp}
										onChange={(e) => setCurrentExp(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</div>
							</div>
						</div>

						<div
							data-tour="muspe"
							className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black"
						>
							<h2 className="text-sm font-semibold tracking-tight">
								Muspellium Prices
							</h2>
							<div className="mt-3 grid gap-2">
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										Muspellium Lvl 1 (Izlude/Prontera)
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={muspe1}
										onChange={(e) => setMuspe1(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										Muspellium Lvl 2 (Morroc)
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={muspe2}
										onChange={(e) => setMuspe2(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										Muspellium Lvl 3 (Alberta)
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={muspe3}
										onChange={(e) => setMuspe3(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										Muspellium Lvl 4 (Payon/Geffen)
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={muspe4}
										onChange={(e) => setMuspe4(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
							</div>
						</div>

						<div
							data-tour="plants"
							className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black"
						>
							<div className="flex items-center justify-between gap-3">
								<h2 className="text-sm font-semibold tracking-tight">
									Plant Prices
								</h2>
								<label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
									<input
										type="checkbox"
										checked={gatherPlants}
										onChange={(e) => setGatherPlants(e.target.checked)}
										className="h-4 w-4"
									/>
									Gather plants
								</label>
							</div>
							<div className="mt-3 grid gap-2">
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										{currentPlants.izlude}
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={plantIzlude}
										onChange={(e) => setPlantIzlude(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										{currentPlants.morroc}
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={plantMorroc}
										onChange={(e) => setPlantMorroc(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										{currentPlants.alberta}
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={plantAlberta}
										onChange={(e) => setPlantAlberta(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										{currentPlants.payon}
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={plantPayon}
										onChange={(e) => setPlantPayon(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="text-zinc-700 dark:text-zinc-300">
										{currentPlants.geffen}
									</span>
									<input
										type="number"
										inputMode="decimal"
										min={0}
										value={plantGeffen}
										onChange={(e) => setPlantGeffen(e.target.value)}
										className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-black"
									/>
								</label>
							</div>
						</div>
					</div>
				</section>

				<section className="flex-none" data-tour="results">
					<div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/15 dark:bg-black">
						<div className="flex flex-col">
							<div className="border-b border-black/10 p-4 dark:border-white/15">
								<div className="text-base font-semibold tracking-tight">
									Results
								</div>
							</div>

							<div className="space-y-3 p-4 md:hidden">
								{rows.map((r) => (
									<div
										key={r.location}
										className={
											r.craftable === true
												? "rounded-lg border border-black/10 bg-green-50 p-3 dark:border-white/15 dark:bg-green-950/20"
												: "rounded-lg border border-black/10 p-3 dark:border-white/15"
										}
									>
										<div className="text-sm font-semibold">{r.location}</div>
										<div className="mt-2 grid gap-2 text-sm">
											<div className="flex items-center justify-between gap-3">
												<div className="text-zinc-700 dark:text-zinc-300">
													Cost per Tap
												</div>
												<div className="font-medium tabular-nums">
													{fmtWholeIfNoDecimals(r.costPerTap)}
												</div>
											</div>

											<div className="flex items-center justify-between gap-3">
												<div className="text-zinc-700 dark:text-zinc-300">
													Cost till Level {nextLevel}
												</div>
												<div className="font-medium tabular-nums">
													{fmtWholeIfNoDecimals(r.costTillNextLevel)}
												</div>
											</div>

											<div className="flex items-center justify-between gap-3">
												<div className="text-zinc-700 dark:text-zinc-300">
													Stamina / Tap
												</div>
												<div className="font-medium tabular-nums">
													{r.staminaPerTap}
												</div>
											</div>

											<div className="flex items-center justify-between gap-3">
												<div className="text-zinc-700 dark:text-zinc-300">
													Total Stamina
												</div>
												<div className="font-medium tabular-nums">
													{r.totalStaminaUsage}
												</div>
											</div>

											{showEstimate && (
												<>
													<div className="flex items-center justify-between gap-3">
														<div className="text-zinc-700 dark:text-zinc-300">
															Taps Needed
														</div>
														<div className="font-medium tabular-nums">
															{r.tapsNeeded}
														</div>
													</div>

													<div className="flex items-center justify-between gap-3">
														<div className="text-zinc-700 dark:text-zinc-300">
															Savings (gather plants)
														</div>
														<div className="font-medium tabular-nums">
															{fmtWholeIfNoDecimals(r.savings ?? "")}
														</div>
													</div>
												</>
											)}
										</div>
									</div>
								))}
							</div>

							<div className="hidden overflow-x-auto md:block">
								<table className="min-w-180 w-full border-collapse text-left text-sm">
									<thead>
										<tr className="border-b border-black/10 dark:border-white/15">
											<th className="p-3 font-medium">Location</th>
											<th className="p-3 font-medium">Cost per Tap</th>
											<th className="p-3 font-medium">
												Cost till Level {nextLevel}
											</th>
											<th className="p-3 font-medium">Stamina / Tap</th>
											<th className="p-3 font-medium">Total Stamina</th>
											{showEstimate && (
												<>
													<th className="p-3 font-medium">Taps Needed</th>
													<th className="p-3 font-medium">
														Savings (gather plants)
													</th>
												</>
											)}
										</tr>
									</thead>
									<tbody>
										{rows.map((r) => (
											<tr
												key={r.location}
												className={
													r.craftable === true
														? "border-b border-black/5 bg-green-50 dark:border-white/10 dark:bg-green-950/20"
														: "border-b border-black/5 dark:border-white/10"
												}
											>
												<td className="p-3">{r.location}</td>
												<td className="p-3">
													{fmtWholeIfNoDecimals(r.costPerTap)}
												</td>
												<td className="p-3">
													{fmtWholeIfNoDecimals(r.costTillNextLevel)}
												</td>
												<td className="p-3">{r.staminaPerTap}</td>
												<td className="p-3">{r.totalStaminaUsage}</td>
												{showEstimate && (
													<>
														<td className="p-3">{r.tapsNeeded}</td>
														<td className="p-3">
															{fmtWholeIfNoDecimals(r.savings ?? "")}
														</td>
													</>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
