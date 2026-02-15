"use client";

import { useEffect, type ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

type BaseModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	ariaLabel?: string;
	size?: ModalSize;
	bodyClassName?: string;
	contentClassName?: string;
};

const sizeClassMap: Record<ModalSize, string> = {
	sm: "max-w-md",
	md: "max-w-2xl",
	lg: "max-w-4xl",
	xl: "max-w-5xl",
	full: "max-w-[96vw]",
};

export default function BaseModal({
	isOpen,
	onClose,
	title,
	children,
	ariaLabel,
	size = "lg",
	bodyClassName,
	contentClassName,
}: BaseModalProps) {
	useEffect(() => {
		// Close on Escape and lock body scroll while modal is open.
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previous;
		};
	}, [isOpen, onClose]);

	// Keep modal behavior predictable: when closed, it is fully unmounted.
	// This avoids unnecessary effects/renders and keeps focus handling simple.
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 opacity-100 transition-opacity duration-200"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel ?? title}
			onClick={onClose}
		>
			<div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<div
					className={`max-h-[90vh] w-full overflow-y-auto rounded-xl border border-black/10 bg-white shadow-2xl transition-all duration-200 translate-y-0 scale-100 opacity-100 dark:border-white/15 dark:bg-black ${sizeClassMap[size]} ${contentClassName ?? ""}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between gap-4 border-b border-black/10 p-3 dark:border-white/15">
						<h5 className="text-lg font-semibold tracking-tight">{title}</h5>
						<button
							type="button"
							className="rounded-lg border border-black/10 bg-zinc-50 px-2.5 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
							onClick={onClose}
							aria-label="Close modal"
						>
							✕
						</button>
					</div>
					<div className={bodyClassName ?? "p-4"}>{children}</div>
				</div>
			</div>
		</div>
	);
}
