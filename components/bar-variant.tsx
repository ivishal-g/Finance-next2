import { BarChart } from "lucide-react"
import { CartesianGrid, ResponsiveContainer } from "recharts"




type Props = {
    data: {
        date: string;
        income: number;
        expenses: number;
    }[];
};



export const BarVariant = ( { data }: Props ) => {

    return (
        <ResponsiveContainer width="100%" height={350} >
            <BarChart >
                <CartesianGrid  strokeDasharray="3 3" />    
            </BarChart>            
        </ResponsiveContainer>
    )
}