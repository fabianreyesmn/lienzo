
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import type { Project } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

export default function TrashPage() {
  const { user, loading: authLoading } = useAuth();
  const [trashedProjects, setTrashedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrashedProjects = useCallback(async () => {
    if (user) {
      setLoading(true);
      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        where("inTrash", "==", true),
        orderBy("lastModified", "desc")
      );
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setTrashedProjects(projects);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchTrashedProjects();
    }
  }, [user, authLoading, fetchTrashedProjects]);

  const handleRestore = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      inTrash: false,
    });
    setTrashedProjects(projects => projects.filter(p => p.id !== projectId));
  };
  
  const handleDeleteForever = async (projectId: string) => {
    await deleteDoc(doc(db, "projects", projectId));
    setTrashedProjects(projects => projects.filter(p => p.id !== projectId));
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
              <h1 className="font-headline text-lg font-semibold">Papelera</h1>
          </div>
          <div className="flex items-center gap-4">
              <UserNav />
          </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
            {loading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : trashedProjects.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                    <Trash2 className="mx-auto h-12 w-12" />
                    <h2 className="mt-4 text-xl font-semibold">La papelera está vacía</h2>
                    <p>Los proyectos que envíes a la papelera aparecerán aquí.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {trashedProjects.map(project => (
                        <li key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div>
                                <h3 className="font-semibold">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">Tipo: {project.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleRestore(project.id)}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restaurar
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El proyecto se borrará para siempre.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteForever(project.id)}
                                        className={buttonVariants({ variant: "destructive" })}
                                      >
                                        Sí, eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </main>
    </div>
  );
}
