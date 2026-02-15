import type { Monster } from "../types";
import MonsterGrid from "./MonsterGrid";

export default function MonsterList({
	monsters,
	animationKey,
	animationDirection,
}: {
	monsters: Monster[];
	animationKey?: string;
	animationDirection?: "left" | "right";
}) {
	return (
		<MonsterGrid
			monsters={monsters}
			animationKey={animationKey}
			animationDirection={animationDirection}
		/>
	);
}
