"use client";

import { useEffect, useState } from "react";

export type TourStep = {
	id: string;
	target: string; // matches data-tour="..."
	title: string;
	description: string;
};

type GuidedTourProps = {
	storageKey: string;
	steps: TourStep[];
};

function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

export default function GuidedTour({ storageKey, steps }: GuidedTourProps) {
	const [isOpen, setIsOpen] = useState(() => {
		if (typeof window === "undefined") return false;
		try {
			return localStorage.getItem(storageKey) !== "1";
		} catch {
			return true;
		}
	});
	const [stepIndex, setStepIndex] = useState(0);
	const [rect, setRect] = useState<DOMRect | null>(null);
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(max-width: 767px)").matches;
	});

	const hasSteps = steps.length > 0;
	const safeIndex = hasSteps ? clamp(stepIndex, 0, steps.length - 1) : 0;
	const step = hasSteps ? steps[safeIndex] : null;
	const target = step?.target ?? null;

	useEffect(() => {
		if (typeof window === "undefined") return;
		const mq = window.matchMedia("(max-width: 767px)");
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		if (!target) return;
		if (isMobile) return;

		const updateRect = () => {
			const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
			if (!el) {
				setRect(null);
				return;
			}
			setRect(el.getBoundingClientRect());
		};

		updateRect();
		window.addEventListener("resize", updateRect);
		window.addEventListener("scroll", updateRect, { passive: true });

		return () => {
			window.removeEventListener("resize", updateRect);
			window.removeEventListener("scroll", updateRect);
		};
	}, [isMobile, isOpen, target]);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isOpen]);

	const closeAndRemember = () => {
		try {
			localStorage.setItem(storageKey, "1");
		} catch {
			// ignore
		}
		setIsOpen(false);
	};

	if (!isOpen || !step) return null;

	const canGoBack = safeIndex > 0;
	const isLast = safeIndex === steps.length - 1;
	const showBack = !isMobile && canGoBack;

	const pad = 8;
	const spotlight =
		!isMobile && rect
			? {
					left: rect.left - pad,
					top: rect.top - pad,
					width: rect.width + pad * 2,
					height: rect.height + pad * 2,
				}
			: null;

	const tooltip = (() => {
		if (isMobile) return null;
		const fallback = { left: 16, top: 16 };
		if (!rect) return fallback;
		const preferredLeft = rect.left;

		const estimatedTooltipHeight = 220;
		const spaceBelow = window.innerHeight - rect.bottom;
		const wouldClipBelow = spaceBelow < estimatedTooltipHeight + 16;
		const preferAbove = isLast || wouldClipBelow;
		const preferredTop = preferAbove
			? rect.top - estimatedTooltipHeight - 12
			: rect.bottom + 12;
		return {
			left: clamp(preferredLeft, 16, window.innerWidth - 320),
			top: clamp(preferredTop, 16, window.innerHeight - 220),
		};
	})();

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/40" />

			{spotlight && (
				<div
					className="absolute rounded-xl border-2 border-white/40"
					style={{
						left: spotlight.left,
						top: spotlight.top,
						width: spotlight.width,
						height: spotlight.height,
					}}
				/>
			)}

			{isMobile ? (
				<div className="absolute inset-0 flex items-center justify-center p-4">
					<div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-4 text-sm dark:border-white/15 dark:bg-black">
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="text-xs text-zinc-700 dark:text-zinc-300">
									Slide {safeIndex + 1} / {steps.length}
								</div>
								<div className="mt-1 text-base font-semibold tracking-tight">
									{step.title}
								</div>
							</div>
							<button
								type="button"
								className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
								onClick={closeAndRemember}
							>
								Skip
							</button>
						</div>

						<div className="mt-2 text-zinc-700 dark:text-zinc-300">
							{step.description}
						</div>

						<div className="mt-4 flex items-center justify-end gap-2">
							<button
								type="button"
								className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
								onClick={() => {
									if (isLast) closeAndRemember();
									else setStepIndex((i) => Math.min(steps.length - 1, i + 1));
								}}
							>
								{isLast ? "Done" : "Next"}
							</button>
						</div>
					</div>
				</div>
			) : (
				<div
					className="absolute w-75 rounded-xl border border-black/10 bg-white p-4 text-sm dark:border-white/15 dark:bg-black"
					style={{ left: tooltip?.left ?? 16, top: tooltip?.top ?? 16 }}
				>
					<div className="text-xs text-zinc-700 dark:text-zinc-300">
						Step {safeIndex + 1} / {steps.length}
					</div>
					<div className="mt-1 text-base font-semibold tracking-tight">
						{step.title}
					</div>
					<div className="mt-1 text-zinc-700 dark:text-zinc-300">
						{step.description}
					</div>

					<div className="mt-4 flex items-center justify-between gap-2">
						<button
							type="button"
							className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
							onClick={closeAndRemember}
						>
							Skip
						</button>

						<div className="flex items-center gap-2">
							{showBack && (
								<button
									type="button"
									className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium dark:border-white/15 dark:bg-black"
									onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
								>
									Back
								</button>
							)}
							<button
								type="button"
								className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
								onClick={() => {
									if (isLast) closeAndRemember();
									else setStepIndex((i) => Math.min(steps.length - 1, i + 1));
								}}
							>
								{isLast ? "Done" : "Next"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
