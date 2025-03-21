import { ComboboxSelect } from "@/components/ui/combobox";
import Company from "@/models/company";
import { useGetAllCompanies } from "@/react-query/company-queries";
import { useMemo } from "react";

const CompanySelect = ({ setCompanyId, companyId }: { setCompanyId: (id: string) => void, companyId: string }) => {
    const { data: companies } = useGetAllCompanies({ page: 1, limit: 1000, search: "" });

    const companyOptions: { label: string; value: string }[] = useMemo(() => {
        const options = companies?.data.companies?.map((company: Company) => ({
            label: company.name,
            value: company.id?.toString() ?? ""
        })) ?? [];

        options.unshift({ label: "All", value: "all" });
        return options
    }, [companies]);


    return (
        <ComboboxSelect
            options={companyOptions as any}
            onValueChange={(value) => {
                setCompanyId(value);
            }}
            value={companyId}

        />
    )
};

export default CompanySelect;