export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-slate-600">{subtitle}</p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full bg-accent-500 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
