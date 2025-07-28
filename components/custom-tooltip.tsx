import { format } from "date-fns";

import { formateCurrency } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";


export const CustomTooltip = ({ active, payload}: any) => {
    if(!active) return null;



    const date = payload[0].payload.date;
    const income = payload[0].value;
    const expenses = payload[1].value;


    return(
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden " >
            <div>
                {format(date, "MMM dd, yyyy")}
            </div>
            <Separator/>
            <div className="p-2 px-3 space-y-1" >
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2" >
                    <div className="size-1.5 bg-blue-500 rounded-full">
                    <p>
                        Income
                    </p>
                    </div>
                    <p className="text-sm text-right font-medium"> 
                        {formateCurrency(income)}
                    </p>
                    </div>
                </div>
            </div>
        </div>
    )


}