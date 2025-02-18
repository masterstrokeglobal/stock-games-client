import PasswordChangeForm from "@/components/common/password-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUpdateAgentPassword } from "@/react-query/agent-queries";
import { ReactNode } from "react";

type Props = {
    agentId: string;
    children: ReactNode
}

const AgentChangePasswordDialog = ({ agentId, children }: Props) => {

    const { mutate, isPending } = useUpdateAgentPassword();

    return (<Dialog>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>

            <div className="py-4">
                <PasswordChangeForm onSubmit={(data) => {
                    mutate({ agentId, password: data.newPassword })
                }} isLoading={isPending} />
            </div>
        </DialogContent>
    </Dialog>);
};

export default AgentChangePasswordDialog;