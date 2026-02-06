// Level list used by calculator selects. Keep in sync with server caps.
export const levels = Array.from({ length: 160 }, (_, index) => index + 1);

// Party size options include "couple" variants for the bonus EXP case.
export const partySizeOptions = [
	{ value: "1", label: "1" },
	{ value: "2", label: "2" },
	{ value: "3", label: "3" },
	{ value: "4", label: "4" },
	{ value: "5", label: "5" },
	{ value: "2c", label: "2 (with Couple EXP +5%)" },
	{ value: "3c", label: "3 (with Couple EXP +5%)" },
	{ value: "4c", label: "4 (with Couple EXP +5%)" },
	{ value: "5c", label: "5 (with Couple EXP +5%)" },
];

// Unique class count used for party bonus calculations.
export const uniqueClassOptions = [1, 2, 3, 4, 5];
