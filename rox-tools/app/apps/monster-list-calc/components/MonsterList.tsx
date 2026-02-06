import type { Monster } from "../types";
import MonsterGrid from "./MonsterGrid";

export default function MonsterList({ monsters }: { monsters: Monster[] }) {
	return <MonsterGrid monsters={monsters} />;
}
