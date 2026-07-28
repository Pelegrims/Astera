export function ReportSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="border-b border-line py-10 last:border-0">
      <h2 className="font-display text-xl font-medium text-gold-soft sm:text-2xl">
        {title}
      </h2>
      <p className="mt-4 text-balance text-base leading-relaxed text-ink-muted">
        {body}
      </p>
    </section>
  );
}
