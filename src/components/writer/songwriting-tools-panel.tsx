
"use client";

import { Music } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChordProgressionGenerator } from "./chord-progression-generator";

interface SongwritingToolsPanelProps extends React.HTMLAttributes<HTMLElement> {}

export function SongwritingToolsPanel(props : SongwritingToolsPanelProps) {

    return (
        <aside {...props} className="border-l bg-card h-full flex flex-col shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-lg font-headline flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    Herramientas de Compositor
                </h2>
            </div>
            
            <ScrollArea className="flex-1">
                 <div className="p-4 space-y-6">
                    <ChordProgressionGenerator />
                    {/* Future songwriting tools will go here */}
                 </div>
            </ScrollArea>
        </aside>
    );
}
