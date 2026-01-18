type PageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function MiniAppPage({ params }: PageProps) {
	const { slug } = await params;
	return (
		<div className="space-y-2">
			<h1 className="text-2xl font-semibold tracking-tight">App: {slug}</h1>
		</div>
	);
}
