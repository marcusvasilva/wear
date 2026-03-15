import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection";
import { GabaritoSection } from "@/components/sections/GabaritoSection";
import { TechSpecsSection } from "@/components/sections/TechSpecsSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ConfiguratorSection />
        <GabaritoSection />
        <TechSpecsSection />
        <SocialProofSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
