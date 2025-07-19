
"use client";

import { Music } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChordProgressionGenerator } from "./chord-progression-generator";
import { Separator } from "../ui/separator";
import { SongStructureAssistant } from "./song-structure-assistant";

interface SongwritingToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    onContentChange: (newContent: string) => void;
}

export function SongwritingToolsPanel({ editorContent, onContentChange, ...props } : SongwritingToolsPanelProps) {

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
                    <Separator />
                    <SongStructureAssistant initialContent={editorContent} onStructureChange={onContentChange} />
                 </div>
            </ScrollArea>
        </aside>
    );
}
