import type { Monster } from "../types";
import { monsterSlug } from "../monsterSlug";
import MonsterInfoCard from "./MonsterInfoCard";

// Single monster card showing headline info and a compact EXP breakdown.
type MonsterCardProps = {
	monster: Monster;
	isTourTarget?: boolean;
};

const cardShellClass =
	"block isolate overflow-hidden rounded-xl outline outline-black/10 bg-white p-4 text-sm shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg dark:outline-white/15 dark:bg-black";
const labelClass = "font-bold text-zinc-700 dark:text-zinc-200";

export default function MonsterCard({
	monster,
	isTourTarget,
}: MonsterCardProps) {
	// Keep card math local and UI-focused; heavy ranking logic belongs in the modal.
	const soloExp = monster.exp?.solo ?? {};
	const href = `/apps/monster-list-calc/${monsterSlug(monster.name)}`;
	return (
		<MonsterInfoCard
			monster={monster}
			href={href}
			className={cardShellClass}
			dataTour={isTourTarget ? "monster-card" : undefined}
			variant="split"
			capitalizeName
			locationWithPin
			renderFooter={() => (
				<div className="mt-3 py-2">
					<div className="inline-flex items-center gap-6 text-base font-semibold">
						<span className="inline-flex items-center gap-2">
							<span className={labelClass}>Base exp:</span>
							<span className="font-bold text-blue-600 dark:text-blue-400">
								{Math.round(soloExp.base ?? 0)}
							</span>
						</span>

						<span className="inline-flex items-center gap-2">
							<span className={labelClass}>Job exp:</span>
							<span className="font-bold text-emerald-600 dark:text-emerald-400">
								{Math.round(soloExp.job ?? 0)}
							</span>
						</span>
					</div>
				</div>
			)}
		/>
	);
}
