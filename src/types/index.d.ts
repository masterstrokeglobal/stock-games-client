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
    placementAllowed?: string;
    search: string;
    type?: string;
    limit?: number;
};