
"use client";

import { NotebookText, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownPreview } from "./markdown-preview";

interface NoteToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
}

export function NoteToolsPanel({ editorContent, ...props }: NoteToolsPanelProps) {
    return (
        <aside {...props} className="border-l bg-card h-full flex flex-col shrink-0">
            <div className="p-4 border-b">
                <h2 className="text-lg font-headline flex items-center gap-2">
                    <NotebookText className="h-5 w-5 text-primary" />
                    Herramientas para Notas
                </h2>
            </div>
            
            <ScrollArea className="flex-1">
                 <div className="p-4 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Previsualización
                        </h3>
                        <MarkdownPreview content={editorContent} />
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
