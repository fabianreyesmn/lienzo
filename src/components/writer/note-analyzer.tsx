
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { summarizeNote } from "@/ai/flows/summarize-note-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, WandSparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NoteAnalyzerProps {
    editorContent: string;
}

export function NoteAnalyzer({ editorContent }: NoteAnalyzerProps) {
    const [summary, setSummary] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!editorContent.trim()) {
            toast.info("No hay contenido que analizar.");
            return;
        }
        
        setIsLoading(true);
        setSummary("");
        setKeywords([]);
        const toastId = toast.loading("Analizando tu nota...", {
            description: "Extrayendo ideas clave."
        });

        try {
            const result = await summarizeNote({ noteContent: editorContent });
            setSummary(result.summary);
            setKeywords(result.keywords);
            toast.success("Análisis completado", { id: toastId });
        } catch (error) {
            console.error("Error analyzing note:", error);
            toast.error("No se pudo analizar la nota.", {
                 description: "Ocurrió un error con la IA. Inténtalo de nuevo.",
                 id: toastId
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="bg-background/50">
            <CardContent className="p-4">
                <Button 
                    onClick={handleAnalyze} 
                    disabled={isLoading || !editorContent.trim()} 
                    className="w-full mb-4"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                    Analizar Nota
                </Button>

                {(summary || keywords.length > 0 || isLoading) && (
                    <div className="space-y-4">
                        {isLoading && !summary && (
                            <div className="text-sm text-muted-foreground text-center">
                                La IA está leyendo tu nota...
                            </div>
                        )}
                        {summary && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Resumen</h4>
                                <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md border">{summary}</p>
                            </div>
                        )}
                        {keywords.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Conceptos Clave</h4>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((word, i) => (
                                        <Badge key={i} variant="secondary">
                                            {word}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
