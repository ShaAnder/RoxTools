import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ResponsiveNav from "./components/ResponsiveNav";
import ScrollToTopButton from "./components/ScrollToTopButton";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Rox Tools",
	description: "Rox Tools for Ragnarok Online (Global)",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-auto md:overflow-hidden`}
			>
				<div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50 md:h-screen">
					<div className="md:h-full">
						<ResponsiveNav />
						<main className="mx-auto max-w-6xl px-4 py-4 md:h-[calc(100vh-56px)] md:overflow-hidden md:px-6 md:py-6">
							<div className="md:h-full md:overflow-hidden">{children}</div>
						</main>
						<ScrollToTopButton />
					</div>
				</div>
			</body>
		</html>
	);
}
