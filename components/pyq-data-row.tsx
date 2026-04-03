"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePaper } from "@/actions/pyq-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  index: number;
  id: string;
  section: string;
  year: number;
  slot: number;
  createdAt: string;
};

export function PaperDataRow({
  index,
  id,
  section,
  year,
  slot,
  createdAt,
}: Props) {
  const router = useRouter();

  async function handleDelete() {
    const { error } = await deletePaper(id);
    if (error) {
      toast("Failed to delete paper", { description: error });
    } else {
      toast("Paper deleted", {
        description: `${section} ${year} Slot ${slot} has been removed.`,
      });
      router.refresh();
    }
  }

  return (
    <div className="font-mono flex items-center gap-4 px-4 py-3 border-x border-t last:border-b first:rounded-t-lg last:rounded-b-lg border-border bg-card text-card-foreground">
      <span className="text-muted-foreground w-6 shrink-0 text-sm">
        {index}
      </span>

      <div className="flex flex-1 items-center gap-6 min-w-0">
        <span className="text-sm font-semibold w-16 shrink-0">{section}</span>
        <span className="text-sm text-muted-foreground w-16 shrink-0">
          CAT {year}
        </span>
        <span className="text-sm text-muted-foreground shrink-0">
          Slot {slot}
        </span>
      </div>

      <span className="text-xs text-muted-foreground w-32 shrink-0 hidden lg:block">
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>

      <div className="flex gap-2 shrink-0">
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
