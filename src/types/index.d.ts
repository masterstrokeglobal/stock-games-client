type PropsWithClassName = {
    className?: string;
};

type PaginationData = {
    limit: number;
    offset: number;
    sortOn?: string | null;
    sortBy?: "ASC" | "DESC" | null;
    search?: string | null;
    totalRecords?: number | null;
}

type SelectOption = { value: string; label: string }

type SearchFilters = {
    page: number;
    active?: string;
    status?: string;
    placementAllowed?: string;
    search: string;
    orderByField?: string;
    orderBy?: string;
    type?: string;
    limit?: number;
};