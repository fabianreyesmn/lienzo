
"use client";

import { Wand2, BookCheck, History, BrainCircuit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../ui/separator";
import { MetricsAnalyzer } from "./metrics-analyzer";
import { VerseSnapshots } from "./verse-snapshots";
import { EvocativeWordsGenerator } from "./evocative-words-generator";
import { RhymeDictionary } from "./rhyme-dictionary";


interface PoetryToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    currentLineText: string;
    selectedText: string;
}

export function PoetryToolsPanel({ editorContent, currentLineText, selectedText, ...props }: PoetryToolsPanelProps) {
    const textToAnalyze = selectedText.trim() ? selectedText : editorContent;

    return (
        <aside {...props} className="border-l bg-card h-full flex flex-col shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-lg font-headline flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Herramientas de Poesía
                </h2>
            </div>
            
            <ScrollArea className="flex-1">
                 <div className="p-4 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <BookCheck className="h-4 w-4" />
                            Análisis de Métrica
                        </h3>
                        <MetricsAnalyzer content={textToAnalyze} hasSelection={!!selectedText.trim()} />
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <History className="h-4 w-4" />
                            Historial de Versos
                        </h3>
                        <VerseSnapshots currentLine={currentLineText} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <BrainCircuit className="h-4 w-4" />
                            Inspiración Temática
                        </h3>
                        <EvocativeWordsGenerator />
                    </div>

                    <Separator />

                    <RhymeDictionary />
                    
                </div>
            </ScrollArea>
        </aside>
    );
}
