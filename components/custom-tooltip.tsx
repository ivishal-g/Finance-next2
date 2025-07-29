import { format } from "date-fns";
import { formateCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";



export const CustomTooltip = ({ active, pay }:any ) => {

  const date = pay[0]?.pay?.date;
  const income = pay[0]?.value;
  const expenses = pay[1]?.value;

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {date ? format(new Date(date), "MMM dd, yyyy") : "Invalid Date"}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-blue-500 rounded-full" />
            <p className="text-sm text-muted-foreground">
              Income
            </p>
          </div>
          <p className="text-sm text-right font-medium">
            {formateCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-red-500 rounded-full" />
            <p className="text-sm text-muted-foreground">
              Expenses
            </p>
          </div>
          <p className="text-sm text-right font-medium">
            {formateCurrency(expenses * -1)}
          </p>
        </div>
      </div>
    </div>
  );
};
