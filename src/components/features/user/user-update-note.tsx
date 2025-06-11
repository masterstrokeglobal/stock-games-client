import User from "@/models/user";
import { useAddUserNote, useGetUserNotes } from "@/react-query/user-queries";
import { UserNoteFormSchema } from "./user-note";
import UserNoteForm from "./user-note";
import { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";


const UserUpdateNote = ({ user }: { user: User }) => {

    const { mutate, isPending } = useAddUserNote();
    const { data: notes, isSuccess, dataUpdatedAt } = useGetUserNotes(user.id);


    const handleSubmit = (data: UserNoteFormSchema) => {
        const userId = user.id?.toString() ?? "";
        mutate({ userId, notes: data.notes });
    };

    const defaultValues: UserNoteFormSchema | null = useMemo(() => {
        if (!isSuccess) return null;
        return {
            notes: notes ?? ""
        };
    }, [notes, isSuccess]);

    if (isPending || !defaultValues) return <LoadingScreen />;

    return (
        <UserNoteForm
            key={dataUpdatedAt}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            isLoading={isPending}
        />

    );
};

export default UserUpdateNote;