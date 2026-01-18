"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
	href: string;
	label: string;
};

const navItems: NavItem[] = [
	{ href: "/apps/enchant-calc", label: "Enchant Calculator" },
];

export default function ResponsiveNav() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen]);

	return (
		<header className="border-b border-black/10 bg-white dark:border-white/15 dark:bg-black">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
				<Link
					href="/apps/enchant-calc"
					className="text-base font-semibold tracking-tight"
				>
					Rox Tools
				</Link>

				<nav className="hidden items-center gap-2 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<button
					type="button"
					className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10 md:hidden"
					aria-label="Open menu"
					onClick={() => setIsOpen(true)}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M4 6H20M4 12H20M4 18H20"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div className="fixed inset-0 z-50 md:hidden">
					<button
						type="button"
						className="absolute inset-0 h-full w-full bg-black/30"
						aria-label="Close menu"
						onClick={() => setIsOpen(false)}
					/>

					<aside className="absolute left-0 top-0 h-full w-72 border-r border-black/10 bg-white p-4 dark:border-white/15 dark:bg-black">
						<div className="flex items-center justify-between gap-3">
							<div className="text-base font-semibold tracking-tight">
								Rox Tools
							</div>
							<button
								type="button"
								className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
								aria-label="Close menu"
								onClick={() => setIsOpen(false)}
							>
								Close
							</button>
						</div>

						<nav className="mt-4 grid gap-2 text-sm">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
									onClick={() => setIsOpen(false)}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</aside>
				</div>
			)}
		</header>
	);
}
