import type { Monster } from "../types";
import MonsterCard from "./MonsterCard";

// Responsive grid wrapper for rendering all monster cards.
export default function MonsterGrid({ monsters }: { monsters: Monster[] }) {
	return (
		<div
			id="monsterGrid"
			className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
		>
			{/* Stable key includes name + level to avoid collisions. */}
			{monsters.map((monster, index) => (
				<MonsterCard
					key={`${monster.name}-${monster.level}`}
					monster={monster}
					isTourTarget={index === 0}
				/>
			))}
		</div>
	);
}
