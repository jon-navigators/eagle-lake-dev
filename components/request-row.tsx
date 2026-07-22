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
    <Card className="flex flex-wrap items-start justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-bark-soft">
          <span className="font-medium text-bark">{request.fromName}</span> asked
          you to
        </p>
        <p className="mt-0.5 font-medium text-bark">{request.title}</p>
        {request.description ? (
          <p className="mt-1 whitespace-pre-wrap text-sm text-bark-soft">
            {request.description}
          </p>
        ) : null}
        {request.dueDate ? (
          <div className="mt-2">
            <Badge tone="neutral">{formatDueDate(request.dueDate)}</Badge>
          </div>
        ) : null}
      </div>

      {/* Accept / Decline sit together on the right — equal weight. */}
      <div className="flex shrink-0 items-center gap-2">
        <form action={acceptRequest}>
          <input type="hidden" name="id" value={request.id} />
          <Button type="submit" variant="secondary" size="sm">
            Accept
          </Button>
        </form>
        <form action={declineRequest}>
          <input type="hidden" name="id" value={request.id} />
          <Button type="submit" variant="ghost" size="sm">
            Decline
          </Button>
        </form>
      </div>
    </Card>
  );
}
