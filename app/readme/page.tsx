import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Create a Supabase project and copy the PostgreSQL connection string into DATABASE_URL.",
  "Run the Prisma migration locally or from CI with npm run db:deploy.",
  "Run supabase-setup.sql in Supabase SQL Editor to create the private documents bucket.",
  "Create Razorpay API keys and a payment.captured webhook for https://your-domain.vercel.app/api/webhooks/razorpay.",
  "Import the GitHub repository into Vercel and add every variable from .env.example.",
  "Deploy with build command npm run build, then open /admin/login using admin/admin123 and save Razorpay details in Admin Settings."
];

export default function ReadmePage() {
  return (
    <main className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>PrintHub Vercel hosting guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Follow these steps to host PrintHub on Vercel with Supabase and Razorpay.</p>
          <ol className="list-decimal space-y-3 pl-6">
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="rounded-lg bg-muted p-4 text-sm">Default admin login: ID <b>admin</b>, password <b>admin123</b>. Change these through environment variables before production traffic.</p>
        </CardContent>
      </Card>
    </main>
  );
}
