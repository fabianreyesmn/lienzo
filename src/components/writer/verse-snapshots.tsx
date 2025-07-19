
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Plus, Copy, X } from "lucide-react";
import { toast } from "sonner";

interface VerseSnapshotsProps {
    currentLine: string;
}

interface Snapshot {
    id: number;
    text: string;
}

export function VerseSnapshots({ currentLine }: VerseSnapshotsProps) {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

    const handleAddSnapshot = () => {
        if (currentLine.trim() === "") {
            toast.info("No se puede guardar un verso vacío.");
            return;
        }
        if (snapshots.some(s => s.text === currentLine)) {
            toast.info("Este verso ya ha sido guardado.");
            return;
        }

        const newSnapshot: Snapshot = {
            id: Date.now(),
            text: currentLine,
        };
        setSnapshots(prev => [newSnapshot, ...prev]);
        toast.success("Verso guardado en el historial.");
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Verso copiado al portapapeles.");
    };

    const handleRemove = (id: number) => {
        setSnapshots(prev => prev.filter(s => s.id !== id));
    };


    return (
        <Card className="bg-background/50">
            <CardContent className="p-2">
                 <Button onClick={handleAddSnapshot} size="sm" className="w-full mb-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Guardar Verso Actual
                </Button>
                <ScrollArea className="h-[150px] w-full rounded-md border">
                    {snapshots.length > 0 ? (
                        <div className="p-2 space-y-2">
                            {snapshots.map(snapshot => (
                                <div key={snapshot.id} className="group flex items-center justify-between text-sm p-2 rounded-md bg-background/50 hover:bg-background">
                                    <p className="truncate pr-2">{snapshot.text}</p>
                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(snapshot.text)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => handleRemove(snapshot.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="h-full flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
                            Guarda versiones de tus versos para no perder inspiración.
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
