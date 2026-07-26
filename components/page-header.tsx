import { Ribbon, Star } from "@/components/ui/flash";

/**
 * The screen-title band: paper ground, 3px black bottom rule, a notched red
 * ribbon carrying the title, a starred subtitle, and right-aligned actions.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b-[3px] border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-6 pb-7 pt-8">
        <div>
          <Ribbon>{title}</Ribbon>
          {subtitle ? (
            <div className="mt-4 flex items-center gap-2.5">
              <Star size={12} className="text-red" />
              <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-body">
                {subtitle}
              </span>
            </div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
