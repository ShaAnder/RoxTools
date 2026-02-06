type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const canGoBack = currentPage > 1;
	const canGoForward = currentPage < totalPages;

	return (
		<nav
			className="flex items-center justify-center gap-2"
			aria-label="Pagination"
		>
			<button
				type="button"
				className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				onClick={() => onPageChange(1)}
				disabled={!canGoBack}
				aria-label="First page"
			>
				&lt;&lt;
			</button>
			<button
				type="button"
				className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!canGoBack}
				aria-label="Previous page"
			>
				&lt;
			</button>
			<button
				type="button"
				className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!canGoForward}
				aria-label="Next page"
			>
				&gt;
			</button>
			<button
				type="button"
				className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				onClick={() => onPageChange(totalPages)}
				disabled={!canGoForward}
				aria-label="Last page"
			>
				&gt;&gt;
			</button>
		</nav>
	);
}
