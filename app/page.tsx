import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/ui/Reveal";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Reveal>
        <TrustStrip />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
      <Footer />
    </main>
  );
}
