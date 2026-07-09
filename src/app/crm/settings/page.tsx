import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Manage your account and preferences</p>
      </div>
      <Card>
        <h3 className="mb-4 font-semibold text-slate-900">Company Profile</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
            <input defaultValue="EstatePro" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input defaultValue="info@estatepro.com" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input defaultValue="+91 78873 77880" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <input defaultValue="Mumbai, India" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" />
          </div>
        </div>
        <Button className="mt-4">Save Changes</Button>
      </Card>
    </div>
  );
}
