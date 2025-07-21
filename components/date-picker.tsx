import * as React from "react";
import { format } from "date-fns";
import { Calendar1Icon, Calendar as CalendarIcon} from "lucide-react";
import { SelectSingleEventHandler} from "react-day-picker";

import { cn } from "@/lib/utils"


import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";




type Props = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?:boolean;
}

export const DatePicker = ({
    value,
    onChange,
    disabled,
}: Props) => {
    return(
    <Popover>
        <PopoverTrigger asChild>
            <Button
            disabled={disabled}
            variant={"outline"}
            className={cn(
                "w-full justify-start font-normal",
                !value && "text-muted-foreground",
            )}
            >
                <Calendar1Icon className="size-4 mr-2"  />
                {value ? format(value, "PPP") : <span>Pick a date</span> }
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <Calendar 
                mode="single"
                selected={value}
                onSelect={onChange}
                disabled={disabled}
                initialFocus
            />
        </PopoverContent>
    </Popover>
    )
}