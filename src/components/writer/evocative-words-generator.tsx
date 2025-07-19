
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, WandSparkles } from "lucide-react";
import { getEvocativeWords } from "@/ai/flows/evocative-words-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

export function EvocativeWordsGenerator() {
    const [theme, setTheme] = useState("");
    const [words, setWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!theme.trim()) return;

        setIsLoading(true);
        setWords([]);
        const toastId = toast.loading("Buscando musas...", {
            description: `Generando palabras para "${theme}"`
        });

        try {
            const result = await getEvocativeWords({ theme });
            setWords(result.words);
            toast.success("¡Inspiración encontrada!", { id: toastId });
        } catch (error) {
            console.error("Error fetching evocative words:", error);
            toast.error("Las musas no responden", {
                 description: "No se pudieron generar palabras. Inténtalo de nuevo.",
                 id: toastId
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (word: string) => {
        navigator.clipboard.writeText(word);
        toast.success(`"${word}" copiado al portapapeles.`);
    }

    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Palabras Evocadoras</CardTitle>
                <CardDescription className="text-xs">
                   Encuentra inspiración a partir de un tema.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <form onSubmit={handleGenerate} className="flex gap-2 mb-4">
                    <Input 
                        placeholder="Escribe un tema o sentimiento..."
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !theme.trim()} size="icon" aria-label="Generar palabras">
                        {isLoading ? <Loader2 className="animate-spin" /> : <WandSparkles className="h-4 w-4" />}
                    </Button>
                </form>
                 {words.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {words.map((word, i) => (
                            <Badge 
                                key={i} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleCopy(word)}
                                title={`Copiar "${word}"`}
                            >
                                {word}
                            </Badge>
                        ))}
                    </div>
                )}
                 {isLoading && (
                    <div className="text-center text-muted-foreground text-sm">
                        Las palabras están naciendo...
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
