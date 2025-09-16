// NOTE: Use Next.js local API routes to avoid backend 404s and baseURL params.

export type ExternalGame = {
    name: string;
    identifier: string;
    thumbnail?: string;
    active: boolean;
    order: number;
};

export const externalGamesAPI = {
    list: async () => {
        const res = await fetch(`/api/superadmin/external-games`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load games (${res.status})`);
        const data = await res.json();
        return { data } as any;
    },

    update: async (identifier: string, payload: Partial<ExternalGame>) => {
        const res = await fetch(`/api/superadmin/external-games/${encodeURIComponent(identifier)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Failed to update game (${res.status})`);
        const data = await res.json();
        return { data } as any;
    },
};


