
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, WandSparkles, Copy } from "lucide-react";
import { getChordProgressions } from "@/ai/flows/chord-progression-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";

const keys = [
    "Do Mayor", "La Menor", "Sol Mayor", "Mi Menor", "Re Mayor", "Si Menor", 
    "La Mayor", "Fa# Menor", "Mi Mayor", "Do# Menor", "Si Mayor", "Sol# Menor",
    "Fa Mayor", "Re Menor", "Sib Mayor", "Sol Menor", "Mib Mayor", "Do Menor"
];
const moods = ["Alegre", "Triste", "Épico", "Relajado", "Intenso", "Nostálgico"];

export function ChordProgressionGenerator() {
    const [selectedKey, setSelectedKey] = useState("");
    const [selectedMood, setSelectedMood] = useState("");
    const [progressions, setProgressions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!selectedKey || !selectedMood) return;

        setIsLoading(true);
        setProgressions([]);
        const toastId = toast.loading("Componiendo armonías...", {
            description: `Buscando acordes en ${selectedKey} con aire ${selectedMood.toLowerCase()}`
        });

        try {
            const result = await getChordProgressions({ key: selectedKey, mood: selectedMood });
            setProgressions(result.progressions);
            toast.success("¡Progresiones listas!", { id: toastId });
        } catch (error) {
            console.error("Error fetching chord progressions:", error);
            toast.error("La inspiración no llega", {
                 description: "No se pudieron generar progresiones. Inténtalo de nuevo.",
                 id: toastId
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (progression: string) => {
        navigator.clipboard.writeText(progression);
        toast.success(`"${progression}" copiado al portapapeles.`);
    }

    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Generador de Acordes</CardTitle>
                <CardDescription className="text-xs">
                   Encuentra la progresión perfecta para tu canción.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <Select onValueChange={setSelectedKey} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tonalidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {keys.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select onValueChange={setSelectedMood} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sentimiento" />
                        </SelectTrigger>
                        <SelectContent>
                            {moods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !selectedKey || !selectedMood} 
                    className="w-full mb-4"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                    Generar Progresiones
                </Button>
                
                <ScrollArea className="h-48 w-full rounded-md border">
                    {progressions.length > 0 ? (
                        <div className="p-2 space-y-2">
                            {progressions.map((prog, i) => (
                                <div key={i} className="group flex items-center justify-between text-sm p-2 rounded-md bg-background/50 hover:bg-background">
                                    <p className="font-mono">{prog}</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(prog)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="h-full flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
                            {isLoading ? "Buscando inspiración..." : "Elige tonalidad y sentimiento para empezar."}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
