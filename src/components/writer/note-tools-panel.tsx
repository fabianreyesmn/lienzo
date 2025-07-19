
"use client";

import { NotebookText, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownPreview } from "./markdown-preview";
import { InteractiveChecklist } from "./interactive-checklist";
import { NoteAnalyzer } from "./note-analyzer";
import { SheetHeader, SheetTitle } from "../ui/sheet";

interface NoteToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    onContentChange: (newContent: string) => void;
    isSheet?: boolean;
    title?: string;
}

export function NoteToolsPanel({ editorContent, onContentChange, isSheet, title, ...props }: NoteToolsPanelProps) {
    const mainContent = (
         <div className="p-4 space-y-6">
            <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    Previsualización y Tareas
                </h3>
                <MarkdownPreview content={editorContent} />
                <InteractiveChecklist content={editorContent} onContentChange={onContentChange} />
            </div>
             <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    Análisis con IA
                </h3>
                <NoteAnalyzer editorContent={editorContent} />
            </div>
        </div>
    );
    
    if (isSheet) {
        return (
            <div {...props} className="h-full flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <NotebookText className="h-5 w-5 text-primary" />
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
                    <NotebookText className="h-5 w-5 text-primary" />
                    Herramientas para Notas
                </h2>
            </div>
            
            <ScrollArea className="flex-1">
                {mainContent}
            </ScrollArea>
        </aside>
    );
}
