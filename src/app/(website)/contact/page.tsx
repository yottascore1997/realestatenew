import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-slate-900">Contact Us</h1>
        <p className="website-body-text mt-2 text-slate-500">Get in touch with our team</p>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Send Enquiry</h2>
            <form className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" placeholder="your@email.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#4F6BF5]" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                <textarea rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4F6BF5]" placeholder="I'm interested in..." />
              </div>
              <Button type="submit" className="w-full">Submit Enquiry</Button>
            </form>
          </Card>
          <div className="space-y-6">
            <Card className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-[#4F6BF5]" />
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p className="text-slate-500">+91 98765 43210</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-[#4F6BF5]" />
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p className="text-slate-500">info@estatepro.com</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-[#4F6BF5]" />
              <div>
                <p className="font-semibold text-slate-900">Office</p>
                <p className="text-slate-500">Bandra West, Mumbai, Maharashtra 400050</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
