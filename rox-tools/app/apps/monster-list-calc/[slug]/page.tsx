import Image from "next/image";
import { getMonsters } from "../lib/monsters";
import { monsterSlug } from "../monsterSlug";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function MonsterDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const monsters = await getMonsters();
	const monster = monsters.find((item) => monsterSlug(item.name) === slug);

	if (!monster) {
		return (
			<div className="mx-auto w-[80%] px-4 py-6 md:px-6">
				<h1 className="text-2xl font-semibold">Monster not found</h1>
				<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
					We couldn’t find that monster.
				</p>
			</div>
		);
	}

	const imageSrc = monster.image ?? null;
	const initials = monster.name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join("");
	const soloExp = monster.exp?.solo ?? {};
	const odinExp = monster.exp?.odin ?? {};

	return (
		<div className="mx-auto w-[80%] px-4 py-6 md:px-6">
			<div className="flex flex-col gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-black">
				<div className="flex flex-col gap-4 md:flex-row md:items-center">
					<div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-white/5">
						{imageSrc ? (
							<Image
								src={imageSrc}
								alt={monster.name}
								width={112}
								height={112}
								style={{ objectFit: "contain" }}
								unoptimized
							/>
						) : (
							<span className="text-lg font-semibold text-zinc-600 dark:text-zinc-200">
								{initials || "?"}
							</span>
						)}
					</div>
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">
							{monster.name}
						</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
							Location: {monster.location}
						</p>
						<div className="mt-2 flex flex-wrap gap-2 text-sm">
							<span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
								Level {monster.level}
							</span>
							{monster.types?.element && (
								<span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
									{monster.types.element}
								</span>
							)}
							{monster.types?.race && (
								<span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
									{monster.types.race}
								</span>
							)}
							{monster.types?.size && (
								<span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
									{monster.types.size}
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="rounded-xl border border-black/5 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
						<div className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
							EXP
						</div>
						<div className="mt-2 space-y-2">
							<div className="flex items-center justify-between">
								<span>Solo Base</span>
								<span className="font-medium">{soloExp.base ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Solo Job</span>
								<span className="font-medium">{soloExp.job ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Odin Base</span>
								<span className="font-medium">{odinExp.base ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Odin Job</span>
								<span className="font-medium">{odinExp.job ?? 0}</span>
							</div>
						</div>
					</div>

					<div className="rounded-xl border border-black/5 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
						<div className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
							Stats
						</div>
						<div className="mt-2 grid gap-2">
							<div className="flex items-center justify-between">
								<span>HP</span>
								<span className="font-medium">{monster.stats.hp ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>P.DEF</span>
								<span className="font-medium">{monster.stats.pDef ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>M.DEF</span>
								<span className="font-medium">{monster.stats.mDef ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Crit %</span>
								<span className="font-medium">{monster.stats.crit ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Dodge</span>
								<span className="font-medium">{monster.stats.dodge ?? 0}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
