
"use client";

import { Music, BookCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChordProgressionGenerator } from "./chord-progression-generator";
import { Separator } from "../ui/separator";
import { SongStructureAssistant } from "./song-structure-assistant";
import { MetricsAnalyzer } from "./metrics-analyzer";
import { RhymeDictionary } from "./rhyme-dictionary";
import { SheetHeader, SheetTitle } from "../ui/sheet";

interface SongwritingToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    selectedText: string;
    onContentChange: (newContent: string) => void;
    isSheet?: boolean;
    title?: string;
}

export function SongwritingToolsPanel({ editorContent, selectedText, onContentChange, isSheet, title, ...props } : SongwritingToolsPanelProps) {

    const textToAnalyze = selectedText.trim() ? selectedText : editorContent;
    
    const mainContent = (
        <div className="p-4 space-y-6">
            <div>
                 <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                    <BookCheck className="h-4 w-4" />
                    Análisis de Rima
                </h3>
                <MetricsAnalyzer content={textToAnalyze} hasSelection={!!selectedText.trim()} />
            </div>

            <Separator />
            <SongStructureAssistant initialContent={editorContent} onStructureChange={onContentChange} />

            <Separator />
            <ChordProgressionGenerator />

            <Separator />
            <RhymeDictionary />
         </div>
    );

    if (isSheet) {
        return (
            <div {...props} className="h-full flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-primary" />
                        <span>{title}</span>
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1">
                    {mainContent}
                </ScrollArea>
            </div>
        );
    }
    
    return (
        <aside {...props} className="border-l bg-card h-full flex flex-col shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-lg font-headline flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    Herramientas de Compositor
                </h2>
            </div>
            
            <ScrollArea className="flex-1">
                 {mainContent}
            </ScrollArea>
        </aside>
    );
}
