import { Card } from "@/components/ui/card";
import { SalesChart } from "@/components/crm/sales-chart";
import { LeadSourcesChart } from "@/components/crm/lead-sources-chart";
import { dashboardStats, salesChartData, leadSourcesData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500">Analytics and performance insights</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Monthly Revenue</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(dashboardStats.totalRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-slate-900">24.8%</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Avg Deal Size</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(385000)}</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SalesChart data={salesChartData} />
        <LeadSourcesChart
          data={leadSourcesData.map((s) => ({ ...s, count: s.value }))}
          total={leadSourcesData.reduce((sum, s) => sum + s.value, 0)}
        />
      </div>
    </div>
  );
}
