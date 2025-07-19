
"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
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
            line: `L${index + 1}`,
            syllables: countSyllables(line),
            fullLineText: line,
        })).filter(d => d.syllables > 0);

    }, [content]);

    const chartHeight = Math.max(150, chartData.length * 30);
    const containerHeight = Math.min(chartHeight, 400); // Max height of 400px

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
                     <ScrollArea style={{ height: `${containerHeight}px` }}>
                        <ChartContainer config={chartConfig} className="h-[--chart-height] min-w-[200px]" style={{ '--chart-height': `${chartHeight}px` } as React.CSSProperties}>
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
                                    tickMargin={5}
                                    axisLine={false}
                                    className="text-xs fill-muted-foreground"
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        labelKey="fullLineText" 
                                        className="w-56"
                                        formatter={(value, name) => (
                                          <div className="flex flex-col">
                                            <span>{value} sílabas</span>
                                          </div>
                                        )}
                                    />}
                                />
                                <Bar dataKey="syllables" fill="var(--color-syllables)" radius={4}>
                                    <LabelList
                                        dataKey="syllables"
                                        position="right"
                                        offset={8}
                                        className="fill-foreground font-bold text-xs"
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                     </ScrollArea>
                ) : (
                    <div className="h-[150px] flex items-center justify-center text-xs text-muted-foreground">
                        No hay texto para visualizar.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
