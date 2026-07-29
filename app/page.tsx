import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SampleReport } from "@/components/landing/SampleReport";
import { StatsBand } from "@/components/landing/StatsBand";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/ui/Reveal";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <SampleReport />
      </Reveal>
      <Reveal>
        <StatsBand />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
      <Footer />
    </main>
  );
}
