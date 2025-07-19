
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

    const chartInternalHeight = Math.max(150, chartData.length * 35);

    return (
        <Card className="bg-background/50 overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Estructura Métrica</CardTitle>
                <CardDescription className="text-xs">
                    {hasSelection ? "Visualización de la estrofa seleccionada." : "Visualización de todo el poema."}
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pr-4 pt-0">
                {chartData.length > 0 ? (
                     <ScrollArea className="h-[200px]">
                        <ChartContainer 
                            config={chartConfig} 
                            className="w-full" 
                            style={{ height: `${chartInternalHeight}px` }}
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                layout="vertical"
                                margin={{ left: 10, top: 5, right: 10, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="line"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={5}
                                    axisLine={false}
                                    interval={0}
                                    className="text-xs fill-muted-foreground"
                                    width={40}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        indicator="line"
                                        labelKey="fullLineText" 
                                        className="w-56"
                                        formatter={(value) => (
                                          <div className="font-medium">{`${value} sílabas`}</div>
                                        )}
                                    />}
                                />
                                <Bar dataKey="syllables" fill="var(--color-syllables)" radius={4} barSize={20}>
                                    <LabelList
                                        dataKey="syllables"
                                        position="insideRight"
                                        offset={8}
                                        className="fill-primary-foreground font-bold text-xs"
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                     </ScrollArea>
                ) : (
                    <div className="h-[150px] flex items-center justify-center text-xs text-muted-foreground">
                        Escribe algo para visualizar su estructura.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
