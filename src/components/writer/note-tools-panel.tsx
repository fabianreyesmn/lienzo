
"use client";

import { NotebookText, BrainCircuit, ListTodo } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteAnalyzer } from "./note-analyzer";
import { Separator } from "../ui/separator";
import { InteractiveChecklist } from "./interactive-checklist";

interface NoteToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    onContentChange: (newContent: string) => void;
}

export function NoteToolsPanel({ editorContent, onContentChange, ...props }: NoteToolsPanelProps) {
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
                            <BrainCircuit className="h-4 w-4" />
                            Análisis Inteligente
                        </h3>
                        <NoteAnalyzer editorContent={editorContent} />
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <ListTodo className="h-4 w-4" />
                            Lista de Tareas
                        </h3>
                        <InteractiveChecklist 
                            content={editorContent}
                            onContentChange={onContentChange}
                        />
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
