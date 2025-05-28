"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import { useParams, useRouter } from "next/navigation";
import UserCard from "@/components/features/user/user-card";
import { useGetContactById, useUpdateContactById } from "@/react-query/contact-queries";
import Contact from "@/models/contact";
import ContactEditForm from "@/components/features/contact/contact-update-form";

const EditContactPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetContactById(id.toString());
    const { mutate, isPending } = useUpdateContactById();
    const router = useRouter();

    const contact = useMemo(() => {
        if (isSuccess && data?.data) return new Contact(data?.data);

        return null;
    }, [data,isSuccess]);

    const onSubmit = (updatedData: any) => {
        mutate({
            id,
            ...updatedData,
        }, {
            onSuccess: () => {
                router.push("/dashboard/contact");
            },
        });
    };

    if (isLoading && contact == null) return <LoadingScreen>Loading contact...</LoadingScreen>;

    return (
        <>
            {contact && contact.user && <UserCard user={contact.user} />}

            {isSuccess && contact && (
                <ContactEditForm
                    contact={contact}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            )}
        </>
    );
};

export default EditContactPage;