import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Users, Droplets, DollarSign, PlusCircle, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Line } from "recharts";


const chartData = [
  { month: "Jan", collected: 1890, target: 1600 },
  { month: "Feb", collected: 2100, target: 1800 },
  { month: "Mar", collected: 2350, target: 2000 },
  { month: "Apr", collected: 1980, target: 2100 },
  { month: "May", collected: 2500, target: 2200 },
  { month: "Jun", collected: 2200, target: 2300 },
];

const chartConfig = {
  collected: {
    label: "Collected (Liters)",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target (Liters)",
    color: "hsl(var(--chart-2))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        icon={LayoutDashboard}
        description="Overview of milk collection and farmer activities."
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/deliveries/record">
                <PlusCircle className="mr-2 h-4 w-4" /> Record Delivery
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/farmers/new">
                <Users className="mr-2 h-4 w-4" /> Register Farmer
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Total Farmers" value="125" icon={Users} description="+5 this month" />
        <StatCard title="Milk Collected Today" value="1,250 L" icon={Droplets} description="Avg. 10L per farmer" />
        <StatCard title="Total Payments (Month)" value="UGX 15.5M" icon={DollarSign} description="For 12,900 Liters" />
        <StatCard title="Quality Issues" value="3 Alerts" icon={LineChart} description="Needs attention" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Milk Collection Trend (Monthly)</CardTitle>
            <CardDescription>Comparison of collected milk vs. target.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="collected" fill="var(--color-collected)" radius={4} />
                  <Bar dataKey="target" fill="var(--color-target)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span>New Farmer Registered: Alice W.</span>
                <span className="text-muted-foreground">10 min ago</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Milk Delivery: John D. - 25L (Good)</span>
                <span className="text-muted-foreground">30 min ago</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span>Payment Processed for Jane S.</span>
                <span className="text-muted-foreground">1 hour ago</span>
              </li>
              <li className="flex items-center justify-between text-sm text-destructive">
                <span>Quality Alert: Peter K. - Low Fat</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
