import Link from "next/link";

export default function AppsIndexPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight">Apps</h1>
			</div>

			<div>
				<Link
					href="/apps/enchant-calc"
					className="block rounded-lg border border-black/10 bg-white p-4 font-medium transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				>
					Enchant Calculator
				</Link>
			</div>
		</div>
	);
}
