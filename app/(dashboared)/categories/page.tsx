"use client";



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";






const CategoriesPage = () => {
    const newAccount = useNewAccount();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];
    const deleteAccounts = useBulkDeleteAccounts();
    

    const isDisabled = 
        accountsQuery.isLoading ||
        accountsQuery.isFetching;


    if( accountsQuery.isLoading ) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24  " >
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center " >
                            <Loader2 className="size-6 text-slate-300 animate-spin " />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return ( 
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 " >
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Categories Page
                    </CardTitle>
                    <Button onClick={newAccount.onOpen } size={"sm"}>
                        <Plus className="size-4 mr-2" />
                            Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={accounts} 
                        filterKey="email"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteAccounts.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoriesPage;
