"use client";

import GuidedTour, { type TourStep } from "../../components/GuidedTour";
import { useMemo } from "react";

const STORAGE_KEY = "rox-tools.enchant-calc.tour.v1.seen";

export default function EnchantTour() {
	const steps: TourStep[] = useMemo(
		() => [
			{
				id: "basics",
				target: "basics",
				title: "Basics",
				description:
					"Choose your enchant type first. If you have Smithing, enter your Smithing level to highlight which locations you can craft at. Optionally enter your current Enchant Level and a Rough % (your estimated progress toward the next level).",
			},
			{
				id: "muspe",
				target: "muspe",
				title: "Muspellium Prices",
				description:
					"Enter the current market price for each Muspellium tier (I–IV). These prices drive the cost-per-tap and the total cost estimates.",
			},
			{
				id: "plants",
				target: "plants",
				title: "Plant Prices",
				description:
					"Enter plant prices for each town (Izlude → Geffen). If you farm your own plants, turn on Gather plants to remove plant cost from the totals (stamina usage is still shown).",
			},
			{
				id: "results",
				target: "results",
				title: "Results",
				description:
					"Compare locations by Cost/Tap, Cost to Next Level, and Taps Needed. Taps Needed uses your Rough % if provided. Prontera shows '-' for stamina since it doesn’t follow the same stamina rules.",
			},
		],
		[],
	);

	return <GuidedTour storageKey={STORAGE_KEY} steps={steps} />;
}
