import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const AreaVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(parseISO(value), "dd MMM")}
          tickMargin={16}
          tickLine={false}
          axisLine={false}
          style={{ fontSize: "12px" }}
        />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#3d82f6"
          fill="url(#income)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          fill="url(#expenses)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
