// --- NUEVA FUNCIÓN ---
export const normalizeFilters = (query) => {
    const normalized = {};

    for (const key in query) {
        // Detecta formato "campo[operador]"
        const match = key.match(/^(\w+)\[(\w+)\]$/);
        if (match) {
            const [, field, op] = match;
            if (!normalized[field]) normalized[field] = {};
            normalized[field][op] = query[key];
        } else {
            normalized[key] = query[key];
        }
    }

    return normalized;
}