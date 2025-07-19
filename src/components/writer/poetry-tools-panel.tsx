
"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPoetrySuggestions } from "@/ai/flows/poetry-tools-flow";
import { toast } from "sonner";


export function PoetryToolsPanel() {
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

    return (
        <aside className="w-80 border-l bg-card h-full flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-headline flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Herramientas de Poesía
                </h2>
            </div>
            <div className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input 
                        placeholder="Escribe una palabra..."
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Buscar"}
                    </Button>
                </form>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 pt-0 space-y-4">
                   <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base font-semibold">Rimas</CardTitle>
                            <CardDescription className="text-xs">Palabras que riman con &quot;{word || '...'}&quot;</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {rhymes.length > 0 ? (
                                <ul className="text-sm space-y-1">
                                    {rhymes.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            ) : (
                                <p className="text-xs text-muted-foreground">No se encontraron rimas.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base font-semibold">Sinónimos</CardTitle>
                            <CardDescription className="text-xs">Palabras con significado similar.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {synonyms.length > 0 ? (
                                <ul className="text-sm space-y-1">
                                    {synonyms.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            ) : (
                                <p className="text-xs text-muted-foreground">No se encontraron sinónimos.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </aside>
    );
}
