
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/project-card";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { UserNav } from "@/components/dashboard/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export interface Project {
  id: string;
  title: string;
  type: string;
  wordCount: number;
  goal: number;
  lastModified: any;
  coverHint: string;
  userId: string;
  content: string;
  inTrash: boolean;
}

export type NewProjectType = Omit<Project, 'id' | 'lastModified' | 'wordCount' | 'goal' | 'coverHint' | 'userId' | 'content' | 'inTrash'>;
export type EditableProject = Pick<Project, 'id' | 'title' | 'goal'>;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const filterType = searchParams.get('type');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setLoadingProjects(true);
        const q = query(
          collection(db, "projects"), 
          where("userId", "==", user.uid),
          where("inTrash", "==", false),
          orderBy("lastModified", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(userProjects);
        setLoadingProjects(false);
      };
      fetchProjects();
    } else if (!authLoading) {
      setProjects([]);
      setLoadingProjects(false);
    }
  }, [user, authLoading]);

  const addProject = async (project: NewProjectType) => {
    if (!user) return;

    const newProjectData = {
      ...project,
      userId: user.uid,
      wordCount: 0,
      goal: 10000,
      lastModified: serverTimestamp(),
      coverHint: project.type,
      content: "",
      inTrash: false
    };

    const docRef = await addDoc(collection(db, "projects"), newProjectData);
    
    const tempNewProject: Project = {
      ...newProjectData,
      id: docRef.id,
      lastModified: new Date(),
    };
    setProjects([tempNewProject, ...projects]);
  };

  const updateProject = async (updatedProject: EditableProject) => {
    const projectRef = doc(db, "projects", updatedProject.id);
    await updateDoc(projectRef, {
      title: updatedProject.title,
      goal: updatedProject.goal,
    });
    
    setProjects(projects.map(p => p.id === updatedProject.id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      inTrash: true,
    });
    setProjects(projects.filter(p => p.id !== projectId));
  };


  const filteredProjects = useMemo(() => {
    if (!filterType) {
      return projects;
    }
    return projects.filter(p => p.type === filterType);
  }, [projects, filterType]);


  return (
    <div className="flex flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
        <SidebarTrigger className="md:hidden"/>
        <div className="flex-1">
          <h1 className="font-headline text-lg font-semibold">{filterType ? `Proyectos de ${filterType}` : 'Mi Escritorio'}</h1>
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
        {loadingProjects || authLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                ))}
            </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-lg mb-2">{filterType ? `No tienes proyectos de "${filterType}".` : 'Aún no tienes proyectos.'}</p>
            <p>¡Crea uno para empezar a escribir!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onProjectUpdate={updateProject}
                onProjectDelete={deleteProject}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
