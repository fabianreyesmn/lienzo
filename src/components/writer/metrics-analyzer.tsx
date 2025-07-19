
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRhymeScheme, AnalyzedLine } from "@/lib/poetry-analyzer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface MetricsAnalyzerProps {
    content: string;
    hasSelection: boolean;
}

export function MetricsAnalyzer({ content, hasSelection }: MetricsAnalyzerProps) {
    const [analysis, setAnalysis] = useState<AnalyzedLine[] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Reset analysis if content changes (e.g., selection is cleared)
    useEffect(() => {
        setAnalysis(null);
    }, [content]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        const result = getRhymeScheme(content);
        setAnalysis(result);
        setIsAnalyzing(false);
    };

    return (
        <Card className="bg-background/50 overflow-hidden">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-semibold">Esquema de Rima</CardTitle>
                        <CardDescription className="text-xs">
                           {hasSelection ? "Analiza la estrofa seleccionada." : "Selecciona texto para analizar una estrofa."}
                        </CardDescription>
                    </div>
                     <Button onClick={handleAnalyze} disabled={isAnalyzing || !content} size="sm">
                        {hasSelection ? "Analizar Selección" : "Analizar Poema"}
                    </Button>
                </div>
            </CardHeader>
            {analysis && analysis.length > 0 && (
                <CardContent className="p-4 pt-0">
                    <ScrollArea className="h-[150px] w-full rounded-md border text-sm whitespace-pre">
                       <div className="p-3 font-mono">
                         {analysis.map((line, index) => (
                             <div key={index} className="flex justify-between items-center">
                                 <span className="text-muted-foreground flex-1 pr-4">{line.text || "·"}</span>
                                 <span className="font-bold text-primary w-6 text-center">{line.rhyme}</span>
                             </div>
                         ))}
                       </div>
                    </ScrollArea>
                </CardContent>
            )}
        </Card>
    );
}
