import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDueDate } from "@/lib/utils";
import { acceptRequest, declineRequest } from "@/app/(app)/inbox/actions";

export type PendingRequestView = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  fromName: string;
};

/** A line in the inbox: someone asked you to take this on. */
export function RequestRow({ request }: { request: PendingRequestView }) {
  return (
    <Card className="flex flex-col p-5">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red">
        {request.fromName} asked you to
      </p>
      <p className="mt-2 font-display text-[19px] leading-tight text-ink">
        {request.title}
      </p>
      {request.description ? (
        <p className="mt-2 max-w-[60ch] whitespace-pre-wrap text-[14px] leading-relaxed text-body">
          {request.description}
        </p>
      ) : null}
      {request.dueDate ? (
        <div className="mt-3">
          <Badge tone="due">Due {formatDueDate(request.dueDate)}</Badge>
        </div>
      ) : null}

      {/* Accept and Decline carry equal weight — declining is a legitimate choice. */}
      <div className="mt-5 flex items-center gap-3">
        <form action={acceptRequest} className="flex-1">
          <input type="hidden" name="id" value={request.id} />
          <Button type="submit" variant="accept" className="w-full">
            Accept
          </Button>
        </form>
        <form action={declineRequest} className="flex-1">
          <input type="hidden" name="id" value={request.id} />
          <Button type="submit" variant="secondary" className="w-full">
            Decline
          </Button>
        </form>
      </div>
    </Card>
  );
}
