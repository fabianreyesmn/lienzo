
"use client";

import { useState, useEffect } from "react";
import { countSyllables } from "@/lib/syllable-counter";
import { Feather } from "lucide-react";

interface SyllableCounterProps {
    lineText: string;
}

export function SyllableCounter({ lineText }: SyllableCounterProps) {
    const [syllableCount, setSyllableCount] = useState(0);

    useEffect(() => {
        const count = countSyllables(lineText);
        setSyllableCount(count);
    }, [lineText]);

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" title="Contador de sílabas del verso actual">
            <Feather className="h-4 w-4" />
            <span>{syllableCount}</span>
        </div>
    );
}
