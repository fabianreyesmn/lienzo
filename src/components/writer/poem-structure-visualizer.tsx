
"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { countSyllables } from "@/lib/syllable-counter";

interface PoemStructureVisualizerProps {
    content: string;
    hasSelection: boolean;
}

const chartConfig = {
    syllables: {
        label: "Sílabas",
        color: "hsl(var(--primary))",
    },
};

export function PoemStructureVisualizer({ content, hasSelection }: PoemStructureVisualizerProps) {
    const chartData = useMemo(() => {
        if (!content) return [];
        
        const lines = content.split('\n');
        return lines.map((line, index) => ({
            line: `Línea ${index + 1}`,
            syllables: countSyllables(line),
            label: line.length > 25 ? line.substring(0, 22) + '...' : line
        })).filter(d => d.syllables > 0);

    }, [content]);

    const chartHeight = Math.max(200, chartData.length * 35);

    return (
        <Card className="bg-background/50 overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Estructura Métrica</CardTitle>
                <CardDescription className="text-xs">
                    {hasSelection ? "Visualización de la estrofa seleccionada." : "Visualización de todo el poema."}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                {chartData.length > 0 ? (
                     <ChartContainer config={chartConfig} className="h-[--chart-height] w-full" style={{ '--chart-height': `${chartHeight}px` } as React.CSSProperties}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{ left: 10, right: 30 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="line"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={false}
                            />
                             <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="syllables" fill="var(--color-syllables)" radius={4}>
                                <LabelList 
                                    dataKey="label"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-primary-foreground text-xs"
                                    
                                />
                                <LabelList
                                    dataKey="syllables"
                                    position="right"
                                    offset={8}
                                    className="fill-foreground font-bold text-xs"
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
                        No hay texto para visualizar.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
