import type { Monster } from "../types";
import MonsterCard from "./MonsterCard";

// Responsive grid wrapper for rendering all monster cards.
export default function MonsterGrid({
	monsters,
	animationKey,
	animationDirection,
}: {
	monsters: Monster[];
	animationKey?: string;
	animationDirection?: "left" | "right";
}) {
	const animationClass =
		animationDirection === "left"
			? "animate-card-pop-left"
			: "animate-card-pop-right";

	return (
		<div
			key={animationKey}
			id="monsterGrid"
			className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
		>
			{/* Stable key includes name + level to avoid collisions. */}
			{monsters.map((monster, index) => (
				<div
					key={`${monster.name}-${monster.level}`}
					className={animationClass}
					style={{ animationDelay: `${index * 40}ms` }}
				>
					<MonsterCard monster={monster} isTourTarget={index === 0} />
				</div>
			))}
		</div>
	);
}
