import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Monster } from "../types";

type MonsterInfoCardProps = {
	monster: Monster;
	href: string;
	className: string;
	variant: "list" | "split";
	showLevelBadge?: boolean;
	capitalizeName?: boolean;
	locationWithPin?: boolean;
	dataTour?: string;
	renderFooter?: (monster: Monster) => ReactNode;
};

const fallbackAvatarClass =
	"flex h-25 w-25 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-200";
const listTypeChipClass =
	"rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200";
const splitTypeChipClass =
	"inline-flex w-20 items-center justify-center whitespace-nowrap rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-white/10 dark:text-zinc-200 sm:w-24";
const splitLocationRowClass =
	"inline-flex items-center justify-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 sm:justify-start";

function monsterInitials(name: string): string {
	const parts = name.split(" ").filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0]?.charAt(0) ?? "?";
	return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`;
}

function toTitleCase(value: string): string {
	return value
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function MonsterInfoCard({
	monster,
	href,
	className,
	variant,
	showLevelBadge,
	capitalizeName,
	locationWithPin,
	dataTour,
	renderFooter,
}: MonsterInfoCardProps) {
	// Normalize display values once so both layouts stay consistent.
	const imageSrc = monster.image ?? null;
	const displayName = capitalizeName ? toTitleCase(monster.name) : monster.name;

	if (variant === "list") {
		// Compact horizontal card used in list-style contexts.
		return (
			<Link href={href} className={className} data-tour={dataTour}>
				<div className="flex h-full items-center gap-5">
					<div className="flex w-1/4 shrink-0 items-center justify-center">
						{imageSrc ? (
							<Image
								src={imageSrc}
								alt={monster.name}
								width={80}
								height={80}
								loading="lazy"
								decoding="async"
								sizes="80px"
								className="rounded-lg"
								style={{ objectFit: "contain" }}
								unoptimized
							/>
						) : (
							<div className={fallbackAvatarClass}>
								{monsterInitials(monster.name)}
							</div>
						)}
					</div>

					<div className="w-3/4 flex-1 space-y-2">
						<div className="flex items-center gap-2">
							<h5 className="text-lg font-semibold leading-tight">
								{displayName}
							</h5>
							{showLevelBadge && (
								<span className="rounded-full bg-blue-600 px-2.5 py-1 text-sm font-semibold text-white">
									{monster.level}
								</span>
							)}
						</div>

						<p className="text-sm text-zinc-600 dark:text-zinc-300">
							Location: {monster.location}
						</p>

						<div className="flex flex-wrap gap-1 text-sm">
							{monster.types?.element && (
								<span className={listTypeChipClass}>
									{monster.types.element}
								</span>
							)}
							{monster.types?.race && (
								<span className={listTypeChipClass}>{monster.types.race}</span>
							)}
							{monster.types?.size && (
								<span className={listTypeChipClass}>{monster.types.size}</span>
							)}
						</div>

						{renderFooter?.(monster)}
					</div>
				</div>
			</Link>
		);
	}

	// Split layout used by Monsterpedia card grid and modal cards.
	return (
		<Link href={href} className={className} data-tour={dataTour}>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-[136px_1fr] sm:items-center">
				<div className="p-1 sm:p-3">
					<div className="relative mx-auto h-28 w-28 overflow-hidden rounded-lg sm:h-28 sm:w-full">
						{imageSrc ? (
							<Image
								src={imageSrc}
								alt={monster.name}
								fill
								loading="lazy"
								decoding="async"
								sizes="(max-width: 640px) 112px, 136px"
								className="object-contain"
								unoptimized
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-200">
								{monsterInitials(monster.name)}
							</div>
						)}
					</div>
				</div>

				<div className="min-w-0 flex h-full flex-col justify-between gap-2 text-center sm:text-left">
					<div className="truncate text-xl font-semibold tracking-tight">
						{displayName}
					</div>
					{locationWithPin ? (
						<span className={splitLocationRowClass}>
							<span aria-hidden="true">📍</span>
							<span className="cursor-pointer hover:underline">
								{monster.location}
							</span>
						</span>
					) : (
						<span className="text-sm text-zinc-600 dark:text-zinc-400">
							{monster.location}
						</span>
					)}

					<div className="flex flex-nowrap justify-center gap-1 text-xs sm:justify-start sm:text-sm">
						{monster.types?.element && (
							<span className={splitTypeChipClass}>
								{monster.types.element}
							</span>
						)}
						{monster.types?.race && (
							<span className={splitTypeChipClass}>{monster.types.race}</span>
						)}
						{monster.types?.size && (
							<span className={splitTypeChipClass}>{monster.types.size}</span>
						)}
					</div>

					{renderFooter?.(monster)}
				</div>
			</div>
		</Link>
	);
}
