"use client";

import { useMemo } from "react";
import GuidedTour, { type TourStep } from "../../components/GuidedTour";

export const MONSTER_TOUR_STORAGE_KEY = "rox-tools.monster-list.tour.v1";

export default function MonsterTour() {
	const steps = useMemo<TourStep[]>(
		() => [
			{
				id: "calculator",
				target: "monster-calculator",
				title: "EXP Calculator",
				description:
					"Set your level, party size, unique classes, and world level to shape EXP recommendations. Toggle Odin for 5x EXP and the Base EXP > 50% rule.",
			},
			{
				id: "filters",
				target: "monster-filters",
				title: "Monster Filters",
				description:
					"Search by monster name or narrow results by size and race/property using the dropdowns.",
			},
			{
				id: "card",
				target: "monster-card",
				title: "Monster Cards",
				description:
					"Each card shows monster stats and card drop info. Click a card to open its detail page.",
			},
			{
				id: "pagination",
				target: "monster-pagination",
				title: "Pagination",
				description:
					"Use the arrows to jump to the first/last page or move one page at a time.",
			},
		],
		[],
	);

	return <GuidedTour storageKey={MONSTER_TOUR_STORAGE_KEY} steps={steps} />;
}
