export function EmptyState({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-dark bg-cream/50 p-10 text-center">
      <p className="text-lg text-bark">{title}</p>
      {hint ? <p className="mt-1 text-sm text-bark-soft">{hint}</p> : null}
      {children ? <div className="mt-4 flex justify-center">{children}</div> : null}
    </div>
  );
}
