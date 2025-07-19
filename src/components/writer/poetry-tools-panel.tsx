
"use client";

import { useState } from "react";
import { Wand2, Loader2, BookCheck, History, BrainCircuit, BarChartHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPoetrySuggestions } from "@/ai/flows/poetry-tools-flow";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { MetricsAnalyzer } from "./metrics-analyzer";
import { VerseSnapshots } from "./verse-snapshots";
import { EvocativeWordsGenerator } from "./evocative-words-generator";
import { PoemStructureVisualizer } from "./poem-structure-visualizer";


interface PoetryToolsPanelProps extends React.HTMLAttributes<HTMLElement> {
    editorContent: string;
    currentLineText: string;
    selectedText: string;
}

export function PoetryToolsPanel({ editorContent, currentLineText, selectedText, ...props }: PoetryToolsPanelProps) {
    const [word, setWord] = useState("");
    const [rhymes, setRhymes] = useState<string[]>([]);
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word.trim()) return;

        setIsLoading(true);
        setRhymes([]);
        setSynonyms([]);
        const toastId = toast.loading("Buscando inspiración...", {
            description: `Analizando la palabra "${word}"`
        });

        try {
            const result = await getPoetrySuggestions({ word });
            setRhymes(result.rhymes);
            setSynonyms(result.synonyms);
            toast.success("¡Sugerencias listas!", { id: toastId });
        } catch (error) {
            console.error("Error fetching poetry suggestions:", error);
            toast.error("Error al buscar", {
                 description: "No se pudieron obtener las sugerencias. Inténtalo de nuevo.",
                 id: toastId 
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            <BarChartHorizontal className="h-4 w-4" />
                            Visualizador de Estructura
                        </h3>
                        <PoemStructureVisualizer content={textToAnalyze} hasSelection={!!selectedText.trim()} />
                    </div>

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

                    <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            Diccionario de Rimas y Sinónimos
                        </h3>
                        <form onSubmit={handleSearch}>
                             <div className="flex gap-2 mb-4">
                                <Input 
                                    placeholder="Escribe una palabra..."
                                    value={word}
                                    onChange={(e) => setWord(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button type="submit" disabled={isLoading} size="icon" aria-label="Buscar sugerencias">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </form>
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base font-semibold">Rimas</CardTitle>
                                    <CardDescription className="text-xs">Palabras que riman con &quot;{word || '...'}&quot;</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <ScrollArea className="h-32">
                                        {rhymes.length > 0 ? (
                                            <ul className="text-sm space-y-1">
                                                {rhymes.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-muted-foreground h-full flex items-center justify-center">No se encontraron rimas.</p>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base font-semibold">Sinónimos</CardTitle>
                                    <CardDescription className="text-xs">Palabras con significado similar.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <ScrollArea className="h-32">
                                    {synonyms.length > 0 ? (
                                        <ul className="text-sm space-y-1">
                                            {synonyms.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-muted-foreground h-full flex items-center justify-center">No se encontraron sinónimos.</p>
                                    )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
