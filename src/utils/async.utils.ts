export async function asyncFilter<T>(
	arr: T[],
	filter: (element: T) => Promise<boolean>
): Promise<T[]> {
	const results = await Promise.all(arr.map(filter));

	return arr.filter((_, i) => results[i]);
}
