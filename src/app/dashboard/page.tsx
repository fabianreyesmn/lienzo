
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
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
}

export type NewProjectType = Omit<Project, 'id' | 'lastModified' | 'wordCount' | 'goal' | 'coverHint' | 'userId' | 'content'>;

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setLoadingProjects(true);
        const q = query(
          collection(db, "projects"), 
          where("userId", "==", user.uid),
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
      goal: 0,
      lastModified: serverTimestamp(),
      coverHint: "new project",
      content: ""
    };

    const docRef = await addDoc(collection(db, "projects"), newProjectData);
    
    // Optimistically update UI
    const tempNewProject: Project = {
      ...newProjectData,
      id: docRef.id,
      lastModified: new Date(),
    };
    setProjects([tempNewProject, ...projects]);
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
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-lg mb-2">Aún no tienes proyectos.</p>
            <p>¡Crea uno para empezar a escribir!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
