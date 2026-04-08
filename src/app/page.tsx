import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { ProofSection } from "@/components/sections/ProofSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ObjectionsSection } from "@/components/sections/ObjectionsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { GabaritoSection } from "@/components/sections/GabaritoSection";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ProofSection />
        <BenefitsSection />
        <ObjectionsSection />
        <HowItWorksSection />
        <ConfiguratorSection />
        <GuaranteeSection />
        <SocialProofSection />
        <GabaritoSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
