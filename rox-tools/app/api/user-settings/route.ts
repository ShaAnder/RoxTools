import { NextResponse } from "next/server";

export type UserSettings = {
	enchantType?: "wep" | "armor" | "acc";
	currentLevel?: number;
	currentExp?: number;
	smithingLevel?: number;
	muspePrices?: {
		1?: number;
		2?: number;
		3?: number;
		4?: number;
	};
	plantPrices?: {
		izlude?: number;
		morroc?: number;
		alberta?: number;
		payon?: number;
		geffen?: number;
	};
};

type ApiResponse = {
	authenticated: boolean;
	userId: string | null;
	settings: UserSettings;
};

const defaultSettings: UserSettings = {
	enchantType: "wep",
	currentLevel: 1,
	currentExp: 0,
	smithingLevel: 0,
	muspePrices: { 1: 0, 2: 0, 3: 0, 4: 0 },
	plantPrices: { izlude: 0, morroc: 0, alberta: 0, payon: 0, geffen: 0 },
};

function json(data: ApiResponse, init?: ResponseInit) {
	return NextResponse.json(data, {
		status: init?.status ?? 200,
		headers: init?.headers,
	});
}

function normalizeNumber(value: unknown): number | undefined {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim().length > 0) {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return undefined;
}

function getRecord(value: unknown): Record<string, unknown> | null {
	if (!value || typeof value !== "object") return null;
	return value as Record<string, unknown>;
}

function normalizeSettings(body: unknown): UserSettings | null {
	if (!body || typeof body !== "object") return null;
	const obj = body as Record<string, unknown>;

	const enchantTypeRaw = obj.enchantType;
	const enchantType =
		enchantTypeRaw === "wep" ||
		enchantTypeRaw === "armor" ||
		enchantTypeRaw === "acc"
			? enchantTypeRaw
			: undefined;

	const currentLevel = normalizeNumber(obj.currentLevel);
	const currentExp = normalizeNumber(obj.currentExp);
	const smithingLevel = normalizeNumber(obj.smithingLevel);

	const muspePricesRaw = obj.muspePrices;
	const muspePricesObj = getRecord(muspePricesRaw);
	const muspePrices = muspePricesObj
		? {
				1: normalizeNumber(muspePricesObj["1"]),
				2: normalizeNumber(muspePricesObj["2"]),
				3: normalizeNumber(muspePricesObj["3"]),
				4: normalizeNumber(muspePricesObj["4"]),
			}
		: undefined;

	const plantPricesRaw = obj.plantPrices;
	const plantPricesObj = getRecord(plantPricesRaw);
	const plantPrices = plantPricesObj
		? {
				izlude: normalizeNumber(plantPricesObj["izlude"]),
				morroc: normalizeNumber(plantPricesObj["morroc"]),
				alberta: normalizeNumber(plantPricesObj["alberta"]),
				payon: normalizeNumber(plantPricesObj["payon"]),
				geffen: normalizeNumber(plantPricesObj["geffen"]),
			}
		: undefined;

	return {
		enchantType,
		currentLevel,
		currentExp,
		smithingLevel,
		muspePrices,
		plantPrices,
	};
}

export async function GET() {
	const response: ApiResponse = {
		authenticated: false,
		userId: null,
		settings: defaultSettings,
	};
	return json(response);
}

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json(
			{
				authenticated: false,
				userId: null,
				settings: defaultSettings,
			},
			{ status: 400 },
		);
	}

	const incoming = normalizeSettings(body);
	if (!incoming) {
		return json(
			{
				authenticated: false,
				userId: null,
				settings: defaultSettings,
			},
			{ status: 400 },
		);
	}

	// Placeholder behavior:
	// - No auth yet, so we don't persist.
	// - We return the merged settings so the client can confirm the payload shape.
	const merged: UserSettings = {
		...defaultSettings,
		...incoming,
		muspePrices: { ...defaultSettings.muspePrices, ...incoming.muspePrices },
		plantPrices: { ...defaultSettings.plantPrices, ...incoming.plantPrices },
	};

	return json({ authenticated: false, userId: null, settings: merged });
}
