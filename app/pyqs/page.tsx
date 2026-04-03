import { getPapers } from "@/actions/pyq-actions";
import { PaperDataRow } from "@/components/pyq-data-row";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function PYQsPage() {
  const papers = await getPapers();

  return (
    <main className="p-8 flex flex-col gap-4 w-full overflow-hidden items-center">
      <div className="flex w-full justify-between items-center mb-20">
        <h1 className="text-2xl font-bold font-mono">Live PYQs</h1>
        <Button variant="outline" className="group" asChild>
          <Link href="/pyqs/new">
            <Plus className="transition-transform duration-200 group-hover:rotate-90" />
            New Paper
          </Link>
        </Button>
      </div>

      {papers.length === 0 ? (
        <p className="text-muted-foreground font-mono">
          No papers found. Create one using the sidebar or the button above.
        </p>
      ) : (
        <div className="rounded-lg overflow-hidden border border-border w-full">
          {papers.map((paper, i) => (
            <PaperDataRow
              key={paper.id}
              index={i + 1}
              id={paper.id}
              section={paper.section}
              year={paper.year}
              slot={paper.slot}
              createdAt={paper.created_at}
            />
          ))}
        </div>
      )}
    </main>
  );
}
