import { CairnMark } from "@/components/cairn-mark";

/** Dashed hatched panel + a big outlined cairn. Provisional by design. */
export function EmptyState({
  title,
  hint,
  children,
  dashedTop = false,
}: {
  title: string;
  hint?: string;
  children?: React.ReactNode;
  dashedTop?: boolean;
}) {
  return (
    <div className="hatch-paper border-[3px] border-dashed border-ink px-8 py-12 text-center">
      <div className="flex justify-center">
        <CairnMark className="h-[86px] w-[76px]" rays dashedTop={dashedTop} />
      </div>
      <h3 className="mt-6 font-display text-[26px] leading-tight text-ink">
        {title}
      </h3>
      {hint ? (
        <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-body">
          {hint}
        </p>
      ) : null}
      {children ? (
        <div className="mt-6 flex justify-center">{children}</div>
      ) : null}
    </div>
  );
}
