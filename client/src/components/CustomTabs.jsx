/* eslint-disable react/prop-types */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomTabs({ tabs }) {
  if (tabs?.length > 0) {
    return (
      <Tabs defaultValue={tabs[0]?.value}>
        <TabsList className="flex flex-row justify-between overflow-x-auto">
          {tabs?.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:shadow-md rounded-t-md border bg-card text-card-foreground shadow-sm p-4 flex-1 min-w-32 flex-shrink-0 h-24"
            >
              <div className="flex flex-col items-center gap-2">
                {tab.icon}
                <p className="text-sm">{tab.label}</p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs?.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 py-8">
              <p className="text-xl font-bold mb-8">
                {tab.label}
              </p>
              {tab.component}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  } else {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 py-8">
        <p className="text-xl font-bold">No data</p>
      </div>
    );
  }
}
