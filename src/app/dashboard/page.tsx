
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";

const initialProjects = [
  {
    id: "1",
    title: "El Último Suspiro del Invierno",
    type: "Novela",
    wordCount: 54320,
    goal: 100000,
    lastModified: "Hace 2 horas",
    coverHint: "fantasy landscape",
  },
  {
    id: "2",
    title: "Ecos en la Ciudad de Cristal",
    type: "Poesía",
    wordCount: 2150,
    goal: 10000,
    lastModified: "Ayer",
    coverHint: "abstract city",
  },
  {
    id: "3",
    title: "Guion: Aurora",
    type: "Guion",
    wordCount: 12500,
    goal: 25000,
    lastModified: "Hace 3 días",
    coverHint: "film set",
  },
  {
    id: "4",
    title: "Melodías de un Corazón Roto",
    type: "Cancionero",
    wordCount: 850,
    goal: 5000,
    lastModified: "La semana pasada",
    coverHint: "guitar paper",
  },
  {
    id: "5",
    title: "Ensayos sobre el Tiempo",
    type: "Blog / Ensayos",
    wordCount: 5200,
    goal: 20000,
    lastModified: "Hace 2 semanas",
    coverHint: "old library",
  },
  {
    id: "6",
    title: "Cuaderno de Ideas",
    type: "Notas",
    wordCount: 15300,
    goal: 0,
    lastModified: "Hace 1 mes",
    coverHint: "messy notebook",
  },
];

export type Project = (typeof initialProjects)[0];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (project: Omit<Project, 'id' | 'lastModified' | 'wordCount' | 'goal' | 'coverHint'>) => {
    const newProject: Project = {
      ...project,
      id: (projects.length + 1).toString(),
      wordCount: 0,
      goal: 0,
      lastModified: "Recién creado",
      coverHint: "new project"
    };
    setProjects([newProject, ...projects]);
  };


  return (
    <div className="flex flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
        <SidebarTrigger className="md:hidden"/>
        <div className="flex-1">
          <h1 className="font-headline text-lg font-semibold">Mi Escritorio</h1>
        </div>
        <div className="flex items-center gap-4">
          <NewProjectDialog onProjectCreate={addProject}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </NewProjectDialog>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
