import MonsterListClient from "./components/MonsterListClient";
import { getMonsters } from "./lib/monsters";

export const dynamic = "force-dynamic";

// Page layout: calculator first, filters second, then the monster grid.
export default async function MonsterListCalcPage() {
	const monsters = await getMonsters();
	return <MonsterListClient monsters={monsters} />;
}
