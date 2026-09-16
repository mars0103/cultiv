type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Temporary section scaffold — keeps real Figma copy and page flow/scroll length
 * correct while each section is built out in the next passes.
 */
export function PlaceholderSection({ eyebrow, title, subtitle, className = "", children }: Props) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-6 py-24 text-center ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-display text-[80px] font-bold leading-none text-cultiv-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold text-cultiv-ink md:text-[39px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl font-subtitle text-lg text-cultiv-title">{subtitle}</p>
      )}
      {children}
    </section>
  );
}
