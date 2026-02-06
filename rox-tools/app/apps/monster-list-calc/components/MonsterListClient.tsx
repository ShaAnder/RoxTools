"use client";

import { useMemo, useState } from "react";
import MonsterCalculator from "./MonsterCalculator";
import MonsterFilters from "./MonsterFilters";
import MonsterList from "./MonsterList";
import type { Monster } from "../types";
import Pagination from "../../../components/Pagination";
import MonsterTour, { MONSTER_TOUR_STORAGE_KEY } from "../MonsterTour";

const PAGE_SIZE = 12;

type MonsterListClientProps = {
	monsters: Monster[];
};

export default function MonsterListClient({ monsters }: MonsterListClientProps) {
	const [page, setPage] = useState(1);
	const [tourNonce, setTourNonce] = useState(0);

	const monstersData = useMemo(() => monsters, [monsters]);

	const totalPages = Math.max(1, Math.ceil(monstersData.length / PAGE_SIZE));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const currentSlice = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return monstersData.slice(start, start + PAGE_SIZE);
	}, [monstersData, currentPage]);

	return (
		<div className="no-scrollbar h-full overflow-y-auto">
			<MonsterTour key={tourNonce} />
			<main className="py-4">
				<section className="mx-auto w-[80%] px-4 pb-4 md:px-6">
					<div className="flex w-full flex-col gap-4">
						<MonsterCalculator />
						<MonsterFilters
							monsters={monstersData}
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

				<section className="mx-auto w-[80%] px-4 pb-4 md:px-6">
					<MonsterList monsters={currentSlice} />
				</section>

				<section
					className="mx-auto w-[80%] px-4 pb-6 md:px-6"
					data-tour="monster-pagination"
				>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(nextPage) => {
							const clamped = Math.min(
								Math.max(1, nextPage),
								totalPages
							);
							setPage(clamped);
						}}
					/>
				</section>
			</main>
		</div>
	);
}
