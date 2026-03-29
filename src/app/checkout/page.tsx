import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";

export const metadata = {
  title: "Checkout | Wear Sublimacoes",
  description: "Finalize a compra do seu Wind Banner personalizado",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CheckoutStepper />
      </div>
    </main>
  );
}
