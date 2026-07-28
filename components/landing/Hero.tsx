import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NatalChartMotif } from "@/components/ui/NatalChartMotif";

// A moving chrome/silver gradient — the "metal" accent from the
// astrologer's system (self-expression, creativity), applied directly to
// text via bg-clip-text, with the same shimmer sweep used on buttons.
const metallicText =
  "bg-clip-text text-transparent bg-[length:250%_100%] animate-shimmer bg-[linear-gradient(100deg,#4a5257_0%,#6bb0b0_18%,#5a6469_36%,#c9d0d3_50%,#6bb0b0_64%,#5a6469_82%,#4a5257_100%)]";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-dusk pb-16 pt-16 sm:pt-24">
      <Container width="lg" className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <div className="text-center lg:text-left">
            <p className={`mb-3 inline-block font-display text-lg tracking-[0.15em] ${metallicText}`}>
              ASTERA
            </p>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              Decode Yourself
            </p>
            <h1 className={`text-balance font-display text-4xl font-medium leading-tight sm:text-5xl ${metallicText}`}>
              Your chart, read clearly
              <br />
              not mysteriously.
            </h1>
            <div className={`mx-auto mt-5 h-2 w-24 rounded-full lg:mx-0 ${metallicText.replace("bg-clip-text text-transparent ", "")}`} />
            <p className="mx-auto mt-6 max-w-md text-balance text-base leading-relaxed text-white/70 lg:mx-0">
              Answer a few questions about your birth. A real astrologer
              studies your chart and writes a personal report you can
              actually use — delivered privately, in about 24 hours.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <LinkButton href="/quiz" variant="onDark">
                Start my reading
              </LinkButton>
              <LinkButton href="#how-it-works" variant="ghostOnDark">
                See how it works
              </LinkButton>
            </div>
            <p className="mt-6 text-xs text-white/40">
              Takes 3 minutes · No account needed
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <NatalChartMotif className="w-full" variant="dark" />
          </div>
        </div>
      </Container>
    </section>
  );
}
