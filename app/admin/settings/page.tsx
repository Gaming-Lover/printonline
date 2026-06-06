import { requireAdmin } from "@/lib/auth";
import { getPricing } from "@/lib/pricing";
import { getMaskedSetting } from "@/lib/settings";
import { updateAdminSettings } from "@/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [pricing, razorpayKeyId, razorpayKeySecret, webhookSecret] = await Promise.all([
    getPricing(),
    getMaskedSetting("RAZORPAY_KEY_ID"),
    getMaskedSetting("RAZORPAY_KEY_SECRET"),
    getMaskedSetting("RAZORPAY_WEBHOOK_SECRET")
  ]);

  return (
    <main className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin settings</CardTitle>
          <CardDescription>Update print prices and Razorpay API details without redeploying. Leave secret fields blank to keep current values.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAdminSettings} className="space-y-8">
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Black & White price per page (₹)</Label>
                <Input name="bwPrice" type="number" min="1" defaultValue={pricing.bwPrice} required />
              </div>
              <div>
                <Label>Color price per page (₹)</Label>
                <Input name="colorPrice" type="number" min="1" defaultValue={pricing.colorPrice} required />
              </div>
            </section>

            <section className="space-y-4 rounded-lg border p-4">
              <div>
                <h2 className="font-semibold">Razorpay details</h2>
                <p className="text-sm text-muted-foreground">Current key ID: {razorpayKeyId}; key secret: {razorpayKeySecret}; webhook secret: {webhookSecret}</p>
              </div>
              <div>
                <Label>Razorpay Key ID</Label>
                <Input name="razorpayKeyId" placeholder="rzp_live_xxxxxxxxxxxxx" />
              </div>
              <div>
                <Label>Razorpay Key Secret</Label>
                <Input name="razorpayKeySecret" type="password" placeholder="Leave blank to keep existing secret" />
              </div>
              <div>
                <Label>Razorpay Webhook Secret</Label>
                <Input name="razorpayWebhookSecret" type="password" placeholder="Leave blank to keep existing webhook secret" />
              </div>
            </section>

            <Button>Save settings</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
