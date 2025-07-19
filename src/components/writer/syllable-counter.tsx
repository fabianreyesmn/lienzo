
"use client";

import { useState, useEffect } from "react";
import { countSyllables } from "@/lib/syllable-counter";
import { Feather } from "lucide-react";

interface SyllableCounterProps {
    text: string;
}

export function SyllableCounter({ text }: SyllableCounterProps) {
    const [syllableCount, setSyllableCount] = useState(0);

    useEffect(() => {
        const lines = text.split('\n');
        const lastLine = lines[lines.length - 1] || "";
        const count = countSyllables(lastLine);
        setSyllableCount(count);
    }, [text]);

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Contador de sílabas del último verso">
            <Feather className="h-4 w-4" />
            <span>{syllableCount}</span>
        </div>
    );
}
