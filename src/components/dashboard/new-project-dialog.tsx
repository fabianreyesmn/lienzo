
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

type ProjectType = "Novela" | "Poesía" | "Guion" | "Cancionero" | "Blog / Ensayos" | "Notas";

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
    type: "Blog / Ensayos" as ProjectType,
    icon: <Newspaper className="h-8 w-8" />,
    description: "Artículos, ensayos o entradas de blog.",
  },
  {
    type: "Notas" as ProjectType,
    icon: <Notebook className="h-8 w-8" />,
    description: "Un formato libre para tus ideas, apuntes y más.",
  },
];

interface NewProjectDialogProps {
  children: React.ReactNode;
  onProjectCreate: (project: { title: string; type: ProjectType }) => void;
}

export function NewProjectDialog({ children, onProjectCreate }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [title, setTitle] = useState("");

  const handleSelectType = (type: ProjectType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setTitle("");
  };
  
  const resetAndClose = () => {
    setOpen(false);
    setTimeout(() => {
        setStep(1);
        setSelectedType(null);
        setTitle("");
    }, 300);
  }

  const handleCreateProject = () => {
    if (title && selectedType) {
      onProjectCreate({ title, type: selectedType });
      resetAndClose();
    }
  }


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetAndClose();
      } else {
        setOpen(true);
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-2xl">
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
                  <h3 className="font-semibold">{pt.type}</h3>
                  <p className="text-xs text-muted-foreground">{pt.description}</p>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && selectedType && (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Detalles del Proyecto</DialogTitle>
              <DialogDescription>
                Dale un nombre a tu nueva creación de tipo &quot;{selectedType}&quot;.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
              <div className="py-4 space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="project-title">Título del Proyecto</Label>
                      <Input 
                        id="project-title" 
                        placeholder={`Mi increíble ${selectedType?.toLowerCase()}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                      />
                  </div>
              </div>
              <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>Volver</Button>
                  <Button type="submit">Crear Proyecto</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
