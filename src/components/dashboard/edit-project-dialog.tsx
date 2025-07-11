
"use client";

import { useState } from "react";
import type { EditableProject } from "@/app/dashboard/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProjectDialogProps {
  children: React.ReactNode;
  project: EditableProject;
  onProjectUpdate: (project: EditableProject) => void;
}

export function EditProjectDialog({ children, project, onProjectUpdate }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [goal, setGoal] = useState(project.goal);

  const handleSave = () => {
    onProjectUpdate({
      id: project.id,
      title,
      goal: Number(goal)
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Editar Proyecto</DialogTitle>
          <DialogDescription>
            Ajusta el título y la meta de palabras de tu proyecto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="py-4 space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="project-title">Título del Proyecto</Label>
                  <Input 
                    id="project-title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="project-goal">Meta de Palabras</Label>
                  <Input 
                    id="project-goal"
                    type="number" 
                    value={goal}
                    onChange={(e) => setGoal(Number(e.target.value))}
                    required
                  />
              </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
