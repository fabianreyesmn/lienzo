
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getPoetrySuggestions } from "@/ai/flows/poetry-tools-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookText, Loader2, Wand2 } from "lucide-react";

export function RhymeDictionary() {
    const [word, setWord] = useState("");
    const [rhymes, setRhymes] = useState<string[]>([]);
    const [slantRhymes, setSlantRhymes] = useState<string[]>([]);
    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!word.trim()) return;

        setIsLoading(true);
        setRhymes([]);
        setSlantRhymes([]);
        setSynonyms([]);
        const toastId = toast.loading("Buscando inspiración...", {
            description: `Analizando la palabra "${word}"`
        });

        try {
            const result = await getPoetrySuggestions({ word });
            setRhymes(result.rhymes);
            setSlantRhymes(result.slantRhymes);
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
        <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                <BookText className="h-4 w-4" />
                Diccionario Creativo
            </h3>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                 <Input 
                    placeholder="Escribe una palabra..."
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !word.trim()} size="icon" aria-label="Buscar sugerencias">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 className="h-4 w-4" />}
                </Button>
            </form>
            <div className="space-y-4">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-semibold">Rimas Perfectas</CardTitle>
                        <CardDescription className="text-xs">Palabras que riman con &quot;{word || '...'}&quot;</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <ScrollArea className="h-28">
                            {isLoading && <p className="text-xs text-muted-foreground">Buscando...</p>}
                            {!isLoading && rhymes.length > 0 ? (
                                <ul className="text-sm space-y-1">
                                    {rhymes.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            ) : !isLoading && (
                                <p className="text-xs text-muted-foreground h-full flex items-center justify-center">No se encontraron rimas.</p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base font-semibold">Rimas Imperfectas</CardTitle>
                        <CardDescription className="text-xs">Rimas asonantes o cercanas.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <ScrollArea className="h-28">
                             {isLoading && <p className="text-xs text-muted-foreground">Buscando...</p>}
                            {!isLoading && slantRhymes.length > 0 ? (
                                <ul className="text-sm space-y-1">
                                    {slantRhymes.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            ) : !isLoading && (
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
                        <ScrollArea className="h-28">
                        {isLoading && <p className="text-xs text-muted-foreground">Buscando...</p>}
                        {!isLoading && synonyms.length > 0 ? (
                            <ul className="text-sm space-y-1">
                                {synonyms.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        ) : !isLoading && (
                            <p className="text-xs text-muted-foreground h-full flex items-center justify-center">No se encontraron sinónimos.</p>
                        )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
