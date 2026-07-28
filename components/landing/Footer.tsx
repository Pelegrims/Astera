import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-sm tracking-[0.15em] text-ink-muted">
          ASTERA
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Decode Yourself
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          © {new Date().getFullYear()} Astera. Personal reports, written by
          people.
        </p>
        <a
          href="/bazi"
          className="mt-1 text-xs text-burgundy hover:underline"
        >
          Free BaZi chart calculator →
        </a>
      </Container>
    </footer>
  );
}
