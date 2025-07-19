
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getRhymeScheme, AnalyzedLine } from "@/lib/poetry-analyzer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface MetricsAnalyzerProps {
    content: string;
}

export function MetricsAnalyzer({ content }: MetricsAnalyzerProps) {
    const [analysis, setAnalysis] = useState<AnalyzedLine[] | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        const result = getRhymeScheme(content);
        setAnalysis(result);
        setIsAnalyzing(false);
    };

    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base font-semibold">Esquema de Rima</CardTitle>
                        <CardDescription className="text-xs">Analiza la estructura de rimas de tu poema.</CardDescription>
                    </div>
                     <Button onClick={handleAnalyze} disabled={isAnalyzing || !content} size="sm">
                        Analizar
                    </Button>
                </div>
            </CardHeader>
            {analysis && analysis.length > 0 && (
                <CardContent className="p-4 pt-0">
                    <ScrollArea className="h-[150px] w-full rounded-md border p-3 text-sm">
                       {analysis.map((line, index) => (
                           <div key={index} className="flex justify-between items-center">
                               <span className="truncate text-muted-foreground flex-1 pr-4">{line.text || "·"}</span>
                               <span className="font-bold text-primary w-6 text-center">{line.rhyme}</span>
                           </div>
                       ))}
                    </ScrollArea>
                </CardContent>
            )}
        </Card>
    );
}
