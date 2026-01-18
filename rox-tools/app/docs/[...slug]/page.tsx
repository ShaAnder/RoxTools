type PageProps = {
	params: Promise<{
		slug?: string[];
	}>;
};

export default async function DocsCatchAllPage({ params }: PageProps) {
	const { slug: slugParam } = await params;
	const slug = slugParam ?? [];
	const path = slug.length ? slug.join("/") : "(index)";

	return (
		<div className="space-y-2">
			<h1 className="text-2xl font-semibold tracking-tight">Docs: {path}</h1>
		</div>
	);
}
