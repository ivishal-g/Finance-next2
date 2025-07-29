
"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
}
from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import qs from "query-string";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { subDays } from "date-fns";
import { Suspense } from "react";




export function AccountFilter() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <AccountFilterclient />
    </Suspense>
  )
}




    const AccountFilterclient = () => {
    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId: string = params.get("accountId") ?? "all";
    const from: string = params.get("from") ?? "";
    const to: string = params.get("to") ?? "";


    const defaltTo = new Date();
    const defaultFrom = subDays(defaltTo, 30);

    


    const { 
        isLoading : isLoadingSummary,
    } = useGetSummary();

    const {
        data: accounts,
        isLoading: isLoadingAccounts,
    } = useGetAccounts();

    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue,
            from,
            to,
        };

        if(newValue === "all"){
            query.accountId = "";
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query,
        }, { skipNull: true, skipEmptyString: true  });


        router.push(url);
    }

    

    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={isLoadingAccounts || isLoadingSummary}
        >
            <SelectTrigger
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
                <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    All accounts
                </SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
} 