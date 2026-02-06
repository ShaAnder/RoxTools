import Image from "next/image";
import Link from "next/link";
import type { Monster } from "../types";
import { monsterSlug } from "../monsterSlug";

// Convert a decimal drop chance into a friendly percentage string.
// Uses higher precision for sub-1% values to avoid rounding to 0.0%.
function formatChance(chancePct: number): string {
	const percent = chancePct * 100;
	if (percent < 1) return `${percent.toFixed(2)}%`;
	return `${percent.toFixed(1)}%`;
}

// Fallback avatar for monsters without images: use initials from the name.
function monsterInitials(name: string): string {
	const parts = name.split(" ").filter(Boolean);
	if (parts.length === 1) return parts[0]?.charAt(0) ?? "?";
	return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`;
}

// Single monster card showing headline info and a compact EXP breakdown.
type MonsterCardProps = {
	monster: Monster;
	isTourTarget?: boolean;
};

export default function MonsterCard({
	monster,
	isTourTarget,
}: MonsterCardProps) {
	const imageSrc = monster.image ?? null;
	const soloExp = monster.exp?.solo ?? {};
	const odinExp = monster.exp?.odin ?? {};
	const href = `/apps/monster-list-calc/${monsterSlug(monster.name)}`;
	return (
		<Link
			href={href}
			className="block rounded-xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-black/20 hover:shadow-md dark:border-white/15 dark:bg-black"
			data-tour={isTourTarget ? "monster-card" : undefined}
		>
			<div className="flex h-full items-center gap-5">
				<div className="flex w-1/4 shrink-0 items-center justify-center">
					{imageSrc ? (
						<Image
							src={imageSrc}
							alt={monster.name}
							width={80}
							height={80}
							className="rounded-lg"
							style={{ objectFit: "contain" }}
							unoptimized
						/>
					) : (
						<div className="flex h-25 w-25 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-200">
							{monsterInitials(monster.name)}
						</div>
					)}
				</div>

				<div className="w-3/4 flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<h5 className="text-lg font-semibold leading-tight">
							{monster.name}
						</h5>
						<span className="rounded-full bg-blue-600 px-2.5 py-1 text-sm font-semibold text-white">
							{monster.level}
						</span>
					</div>

					<p className="text-sm text-zinc-600 dark:text-zinc-300">
						Location: {monster.location}
					</p>

					<div className="flex flex-wrap gap-1 text-sm">
						{monster.types?.element && (
							<span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
								{monster.types.element}
							</span>
						)}
						{monster.types?.race && (
							<span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
								{monster.types.race}
							</span>
						)}
						{monster.types?.size && (
							<span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
								{monster.types.size}
							</span>
						)}
					</div>

					<div className="rounded-lg border border-black/5 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
						<div className="flex items-center justify-between">
							<span className="font-medium">Solo</span>
							<span>
								Base {soloExp.base ?? 0} / Job {soloExp.job ?? 0}
							</span>
						</div>
						<div className="mt-1 flex items-center justify-between">
							<span className="font-medium">With Odin</span>
							<span>
								Base {odinExp.base ?? 0} / Job {odinExp.job ?? 0}
							</span>
						</div>
					</div>

					{monster.lootPool?.card && (
						// Card info is optional and only renders when present.
						<div className="text-sm text-zinc-500 dark:text-zinc-400">
							Card: {monster.lootPool.card.type} •
							{monster.lootPool.card.effect} • Drop
							{formatChance(monster.lootPool.card.chancePct ?? 0)}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
