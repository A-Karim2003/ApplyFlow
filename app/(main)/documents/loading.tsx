import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// varied mock document items to prevent a repetitive "clone" appearance
const SKELETON_DOCUMENTS = [
  {
    titleWidth: "w-44",
    metaWidth: "w-28",
    badgeWidth: "w-16",
    linkedWidth: "w-36",
  },
  {
    titleWidth: "w-56",
    metaWidth: "w-32",
    badgeWidth: "w-24",
    linkedWidth: "w-40",
  },
  {
    titleWidth: "w-36",
    metaWidth: "w-24",
    badgeWidth: "w-20",
    linkedWidth: "w-32",
  },
  {
    titleWidth: "w-48",
    metaWidth: "w-30",
    badgeWidth: "w-16",
    linkedWidth: "w-36",
  },
  {
    titleWidth: "w-40",
    metaWidth: "w-28",
    badgeWidth: "w-24",
    linkedWidth: "w-44",
  },
  {
    titleWidth: "w-52",
    metaWidth: "w-26",
    badgeWidth: "w-20",
    linkedWidth: "w-32",
  },
];

export default function Loading() {
  return (
    <div
      className="flex flex-col"
      aria-busy="true"
      aria-label="Loading documents"
    >
      {/* matches outer padding from DocumentsPage */}
      <div className="px-4 pb-8 pt-6 md:px-8">
        <div className="flex flex-col gap-6">
          {/* toolbar: tabs switcher + Upload document button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-9 w-full sm:w-84" />
            <Skeleton className="h-9 w-full sm:w-40" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SKELETON_DOCUMENTS.map((doc, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col gap-3 pt-3">
                  {/* Top row: category icon box + actions menu button */}
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="size-11 rounded-lg" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>

                  {/* Title & file metadata */}
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className={`h-4 ${doc.titleWidth}`} />
                    <Skeleton className={`h-3 ${doc.metaWidth}`} />
                  </div>

                  {/* Document type badge & linked applications count */}
                  <div className="flex flex-col gap-2 pt-0.5">
                    <Skeleton className={`h-5 ${doc.badgeWidth} rounded-md`} />
                    <Skeleton className={`h-3 ${doc.linkedWidth}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
