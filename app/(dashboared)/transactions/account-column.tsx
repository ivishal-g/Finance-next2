import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

import { cn } from "@/lib/utils";


type Props = {
    id: string;
    account: string | null;
    accountId: string | null;
}

export const AccountColumn = ({
    account,
    accountId
}:Props) => {
    const { onOpen: onOpenAccount } = useOpenAccount();

    const onClick = () => {
        if(accountId) {
            onOpenAccount(accountId)
        }
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center cursor-pointer hover:underline "
        >
            {account}
        </div>
    );
};