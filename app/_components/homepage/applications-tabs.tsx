import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemedImage } from "./themed-image";

export function ApplicationsTabs() {
  return (
    <Tabs defaultValue="kanban" className="space-y-4">
      <TabsList aria-label="Applications view">
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="list">List</TabsTrigger>
      </TabsList>

      <TabsContent value="kanban">
        <div className="overflow-hidden rounded-xl border bg-card">
          <ThemedImage
            lightSrc="/application_images/applications-kanban-light.png"
            darkSrc="/application_images/applications-kanban-dark.png"
            alt="Applications Kanban board"
            width={1401}
            height={1004}
          />
        </div>
      </TabsContent>

      <TabsContent value="list">
        <div className="overflow-hidden rounded-xl border bg-card">
          <ThemedImage
            lightSrc="/application_images/applications-list-light.png"
            darkSrc="/application_images/applications-list-dark.png"
            alt="Applications list view"
            width={1401}
            height={1004}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
