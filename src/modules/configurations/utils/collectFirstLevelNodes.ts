export const collectFirstLevelNodes = (node: any): any[] => {
	const results: any[] = [];

	if (typeof node === "object" && node !== null && !Array.isArray(node)) {
		Object.keys(node).forEach((key) => {
			const value = node[key];
			const isArray = Array.isArray(value);
			const isObject = typeof value === "object" && value !== null;

			// Solo agregar si es un objeto o array (nodos estructurales)
			if (isArray || isObject) {
				results.push({
					id: key,
					name: key,
					href: `#${key}`,
					isIcon: false,
				});
			}
		});
	}

	return results;
};
