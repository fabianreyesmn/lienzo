
"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const themes = [
  {
    name: "Café Literario",
    id: "theme-cafe-literario",
    colors: ["#C3A68B", "#6B7A60", "#F9F6F0"],
  },
  {
    name: "Jardín Secreto",
    id: "theme-jardin-secreto",
    colors: ["#B2C8BA", "#E1A084", "#F5F5F5"],
  },
  {
    name: "Minimalista Nocturno",
    id: "dark",
    colors: ["#5C6BC0", "#FFCA28", "#263238"],
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-colors",
              theme === t.id
                ? "border-primary"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              {t.colors.map((color, index) => (
                <div
                  key={index}
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="font-semibold">{t.name}</p>
          </button>
        ))}
      </div>
       <p className="text-xs text-muted-foreground">
        El tema actual es: <span className="font-semibold text-foreground">{themes.find(t => t.id === theme)?.name}</span>.
      </p>
    </div>
  );
}
