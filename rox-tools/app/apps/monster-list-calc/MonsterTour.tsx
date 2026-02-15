"use client";

import { useMemo } from "react";
import GuidedTour, { type TourStep } from "../../components/GuidedTour";

export const MONSTER_TOUR_STORAGE_KEY = "rox-tools.monster-list.tour.v1";
export const MONSTER_TOUR_OPEN_MODAL_EVENT = "monster-tour-open-best-exp-modal";
export const MONSTER_TOUR_COMPLETED_EVENT = "monster-tour-completed";

export default function MonsterTour() {
	// Keep this flow intentional: page features first, then modal-only walkthrough steps.
	const steps = useMemo<TourStep[]>(
		() => [
			{
				id: "filters",
				target: "monster-filters",
				title: "Monster Filters",
				description:
					"Search by monster name or narrow results by size, property, and race using the dropdowns.",
			},
			{
				id: "card",
				target: "monster-card",
				title: "Monster Cards",
				description:
					"Each card shows key monster details and EXP values. Click a card to open its detail page.",
			},
			{
				id: "pagination",
				target: "monster-pagination",
				title: "Pagination",
				description:
					"Use the arrows to jump to the first/last page or move one page at a time.",
			},
			{
				id: "best-exp",
				target: "monster-calculator",
				title: "Best EXP Calculator",
				description:
					"This button opens the Best EXP calculator. Continue to the next step and the modal tutorial will begin.",
			},
			{
				id: "best-exp-inputs",
				target: "monster-calculator-inputs",
				title: "Calculator Inputs",
				description:
					"Set your level, world level, party size, and unique classes to calculate the best EXP targets.",
			},
			{
				id: "best-exp-results",
				target: "monster-calculator-results",
				title: "Best EXP Results",
				description:
					"These cards show the best monster picks for AFK and Odin, split by Base EXP and Job EXP.",
			},
		],
		[],
	);

	return (
		<GuidedTour
			storageKey={MONSTER_TOUR_STORAGE_KEY}
			steps={steps}
			waitForTarget
			targetPollIntervalMs={200}
			onStepChange={(step) => {
				// Open the calculator only when the tour reaches the first modal step.
				if (step.id !== "best-exp-inputs") return;
				if (typeof window === "undefined") return;
				window.dispatchEvent(new CustomEvent(MONSTER_TOUR_OPEN_MODAL_EVENT));
			}}
			onComplete={() => {
				// Notify feature listeners (e.g., modal auto-close) when this tour is completed.
				if (typeof window === "undefined") return;
				window.dispatchEvent(new CustomEvent(MONSTER_TOUR_COMPLETED_EVENT));
			}}
		/>
	);
}
