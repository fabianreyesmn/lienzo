"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book, Feather, Clapperboard, Music, Newspaper, Notebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

type ProjectType = "Novela" | "Poesía" | "Guion" | "Cancionero" | "Blog" | "Notas";

const projectTypes = [
  {
    type: "Novela" as ProjectType,
    icon: <Book className="h-8 w-8" />,
    description: "Para historias largas, con capítulos y personajes.",
  },
  {
    type: "Poesía" as ProjectType,
    icon: <Feather className="h-8 w-8" />,
    description: "Colecciones de poemas, con herramientas de métrica y rima.",
  },
  {
    type: "Guion" as ProjectType,
    icon: <Clapperboard className="h-8 w-8" />,
    description: "Formato estándar para cine, TV o teatro.",
  },
  {
    type: "Cancionero" as ProjectType,
    icon: <Music className="h-8 w-8" />,
    description: "Letras con soporte para acordes y estructura musical.",
  },
  {
    type: "Blog" as ProjectType,
    title: "Blog / Ensayos",
    icon: <Newspaper className="h-8 w-8" />,
    description: "Artículos, ensayos o entradas de blog.",
  },
  {
    type: "Notas" as ProjectType,
    title: "Cuaderno de Notas",
    icon: <Notebook className="h-8 w-8" />,
    description: "Un formato libre para tus ideas, apuntes y más.",
  },
];

export function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);

  const handleSelectType = (type: ProjectType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedType(null);
  };
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
        setStep(1);
        setSelectedType(null);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">¿Qué vas a crear hoy?</DialogTitle>
              <DialogDescription>
                Elige un tipo de proyecto para empezar con las herramientas adecuadas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {projectTypes.map((pt) => (
                <button
                  key={pt.type}
                  onClick={() => handleSelectType(pt.type)}
                  className="p-4 border rounded-lg text-center flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-accent-foreground/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <div className="text-accent-foreground">{pt.icon}</div>
                  <h3 className="font-semibold">{pt.title || pt.type}</h3>
                  <p className="text-xs text-muted-foreground">{pt.description}</p>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Detalles del Proyecto</DialogTitle>
              <DialogDescription>
                Dale un nombre a tu nueva creación de tipo &quot;{selectedType}&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="project-title">Título del Proyecto</Label>
                    <Input id="project-title" placeholder={`Mi increíble ${selectedType?.toLowerCase()}`} />
                </div>
            </div>
            <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>Volver</Button>
                <Button onClick={handleClose}>Crear Proyecto</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
