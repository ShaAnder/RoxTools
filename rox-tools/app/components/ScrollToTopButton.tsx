"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setIsVisible(window.scrollY > 300);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!isVisible) return null;

	return (
		<button
			type="button"
			aria-label="Scroll to top"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="fixed bottom-4 right-4 z-40 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
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
					d="M12 5L5 12M12 5L19 12M12 5V19"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}
