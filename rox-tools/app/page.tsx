import Link from "next/link";

export default function Home() {
	return (
		<div className="space-y-6">
			<section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/15 dark:bg-black">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Rox Tools
				</h1>
				<p className="mt-2 max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
					A small site for ROX Global EU, created to help players with useful
					game resources and calculators.
				</p>
			</section>

			<section>
				<Link
					href="/apps/enchant-calc"
					className="block rounded-xl border border-black/10 bg-white p-5 text-lg font-medium transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:hover:bg-white/5"
				>
					Enchant Calculator
				</Link>
			</section>
		</div>
	);
}
