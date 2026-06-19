import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { getCatalog } from "@/lib/catalog";

export const metadata = {
  title: "Checkout | Wear Sublimacoes",
  description: "Finalize a compra do seu Wind Banner personalizado",
};

export default async function CheckoutPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Breadcrumb
          items={[
            { label: "Configurador", href: "/#configurador" },
            { label: "Checkout" },
          ]}
        />
      </div>

      <CheckoutStepper catalog={catalog} />

      <div className="mt-10 pt-8 border-t border-border">
        <TrustBadges variant="compact" />
      </div>
    </div>
  );
}
