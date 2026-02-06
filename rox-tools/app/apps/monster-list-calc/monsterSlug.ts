// Shared slug helper for routing to monster detail pages.
export function monsterSlug(name: string): string {
	return name.trim().toLowerCase().replace(/[’']/g, "").replace(/\s+/g, "-");
}
