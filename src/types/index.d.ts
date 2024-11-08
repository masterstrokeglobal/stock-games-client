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
    search: string;
    limit?:number;
};