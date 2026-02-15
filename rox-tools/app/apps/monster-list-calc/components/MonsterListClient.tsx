"use client";

import { useMemo, useState } from "react";
import MonsterBestModal from "./MonsterBestModal";
import MonsterFilters from "./MonsterFilters";
import MonsterList from "./MonsterList";
import type { Monster } from "../types";
import Pagination from "../../../components/Pagination";
import MonsterTour, { MONSTER_TOUR_STORAGE_KEY } from "../MonsterTour";

const PAGE_SIZE = 9;
const pageSectionClass = "mx-auto w-[80%] px-4 md:px-6";

type MonsterListClientProps = {
	monsters: Monster[];
};

export default function MonsterListClient({
	monsters,
}: MonsterListClientProps) {
	const [page, setPage] = useState(1);
	const [tourNonce, setTourNonce] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [sizeFilter, setSizeFilter] = useState("");
	const [propertyFilter, setPropertyFilter] = useState("");
	const [raceFilter, setRaceFilter] = useState("");
	const [animationDirection, setAnimationDirection] = useState<
		"left" | "right"
	>("right");

	// Filtering is computed client-side for responsive UI updates.
	const monstersData = useMemo(() => monsters, [monsters]);
	const filteredMonsters = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		return monstersData.filter((monster) => {
			const matchesSearch =
				!query || monster.name.toLowerCase().includes(query);
			const matchesSize =
				!sizeFilter || (monster.types?.size ?? "") === sizeFilter;
			const matchesProperty =
				!propertyFilter || (monster.types?.element ?? "") === propertyFilter;
			const matchesRace =
				!raceFilter || (monster.types?.race ?? "") === raceFilter;

			return matchesSearch && matchesSize && matchesProperty && matchesRace;
		});
	}, [monstersData, searchTerm, sizeFilter, propertyFilter, raceFilter]);

	const handleSearchChange = (value: string) => {
		setAnimationDirection("right");
		setSearchTerm(value);
		setPage(1);
	};

	const handleSizeChange = (value: string) => {
		setAnimationDirection("right");
		setSizeFilter(value);
		setPage(1);
	};

	const handlePropertyChange = (value: string) => {
		setAnimationDirection("right");
		setPropertyFilter(value);
		setPage(1);
	};

	const handleRaceChange = (value: string) => {
		setAnimationDirection("right");
		setRaceFilter(value);
		setPage(1);
	};

	const handleResetFilters = () => {
		setAnimationDirection("right");
		setSearchTerm("");
		setSizeFilter("");
		setPropertyFilter("");
		setRaceFilter("");
		setPage(1);
	};

	const totalPages = Math.max(
		1,
		Math.ceil(filteredMonsters.length / PAGE_SIZE),
	);
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const currentSlice = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredMonsters.slice(start, start + PAGE_SIZE);
	}, [filteredMonsters, currentPage]);

	// Empty-state copy adapts to whichever filters are currently active.
	const trimmedSearchTerm = searchTerm.trim();
	const hasSearchTerm = trimmedSearchTerm.length > 0;
	const typeFiltersUsed = [
		sizeFilter ? `Size: ${sizeFilter}` : null,
		propertyFilter ? `Property: ${propertyFilter}` : null,
		raceFilter ? `Race: ${raceFilter}` : null,
	].filter(Boolean) as string[];
	const hasTypeFilters = typeFiltersUsed.length > 0;

	const noResultsMessage =
		hasSearchTerm && hasTypeFilters
			? `We couldn't find a monster named \"${trimmedSearchTerm}\" with ${typeFiltersUsed.join(", ")}.`
			: hasTypeFilters
				? `We couldn't find any monsters with this type combination: ${typeFiltersUsed.join(", ")}.`
				: hasSearchTerm
					? `We couldn't find any monsters matching \"${trimmedSearchTerm}\".`
					: "No monsters are available right now.";

	return (
		<div className="no-scrollbar h-full overflow-y-auto">
			<MonsterTour key={tourNonce} />
			<main className="py-4">
				<section className={`${pageSectionClass} pb-4`}>
					<div className="flex w-full flex-col gap-4">
						<MonsterFilters
							monsters={monstersData}
							searchTerm={searchTerm}
							onSearchChange={handleSearchChange}
							sizeFilter={sizeFilter}
							onSizeChange={handleSizeChange}
							propertyFilter={propertyFilter}
							onPropertyChange={handlePropertyChange}
							raceFilter={raceFilter}
							onRaceChange={handleRaceChange}
							onResetFilters={handleResetFilters}
							onResetTutorial={() => {
								try {
									localStorage.removeItem(MONSTER_TOUR_STORAGE_KEY);
								} catch {
									// ignore
								}
								setTourNonce((current) => current + 1);
							}}
						/>
					</div>
				</section>

				<section className={`${pageSectionClass} pb-4`}>
					{filteredMonsters.length === 0 ? (
						<div className="rounded-xl bg-white p-6 text-center text-base leading-relaxed font-semibold text-zinc-700 shadow-sm md:text-lg dark:bg-black dark:text-zinc-200">
							{noResultsMessage}
						</div>
					) : (
						<MonsterList
							monsters={currentSlice}
							animationKey={`${searchTerm}-${sizeFilter}-${propertyFilter}-${raceFilter}-${currentPage}-${currentSlice.length}`}
							animationDirection={animationDirection}
						/>
					)}
				</section>

				{filteredMonsters.length > 0 && (
					<section
						className={`${pageSectionClass} pb-6`}
						data-tour="monster-pagination"
					>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={(nextPage) => {
								const clamped = Math.min(Math.max(1, nextPage), totalPages);
								setAnimationDirection(
									clamped >= currentPage ? "right" : "left",
								);
								setPage(clamped);
							}}
						/>
					</section>
				)}
			</main>

			<MonsterBestModal monsters={monstersData} />
		</div>
	);
}
