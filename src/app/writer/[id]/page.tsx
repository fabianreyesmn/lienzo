
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { SyllableCounter } from "@/components/writer/syllable-counter";
import { PoetryToolsPanel } from "@/components/writer/poetry-tools-panel";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"


interface ProjectData {
    title: string;
    content: string;
    userId: string;
    type: string;
}

export default function WriterPage() {
    const { id: projectId } = useParams<{ id: string }>();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [project, setProject] = useState<ProjectData | null>(null);
    const [content, setContent] = useState("");
    const [currentLineText, setCurrentLineText] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const getWordCount = (text: string) => {
        if (!text.trim()) return 0;
        return text.trim().split(/\s+/).length;
    };
    
    const updateCurrentLine = () => {
        if (textareaRef.current) {
            const { value, selectionStart } = textareaRef.current;
            const lines = value.split('\n');
            let charCount = 0;
            for (const line of lines) {
                charCount += line.length + 1; // +1 for the newline character
                if (selectionStart < charCount) {
                    setCurrentLineText(line);
                    return;
                }
            }
             // If cursor is at the very end
            if (selectionStart >= value.length) {
                setCurrentLineText(lines[lines.length - 1]);
            }
        }
    };


    const fetchProject = useCallback(async () => {
        if (!user || !projectId) return;

        try {
            const projectRef = doc(db, "projects", projectId);
            const projectSnap = await getDoc(projectRef);

            if (projectSnap.exists()) {
                const projectData = projectSnap.data() as ProjectData;
                if (projectData.userId === user.uid) {
                    setProject(projectData);
                    const initialContent = projectData.content || "";
                    setContent(initialContent);
                    setCurrentLineText(initialContent.split('\n')[0] || "");
                } else {
                    toast({
                        variant: "destructive",
                        title: "Acceso denegado",
                        description: "No tienes permiso para ver este proyecto.",
                    });
                    router.push("/dashboard");
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "No encontrado",
                    description: "El proyecto que buscas no existe.",
                });
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cargar el proyecto.",
            });
        } finally {
            setLoading(false);
        }
    }, [user, projectId, router, toast]);

    useEffect(() => {
        if (!authLoading) {
            fetchProject();
        }
    }, [authLoading, fetchProject]);
    
    const handleSave = async () => {
        if (!projectId || isSaving) return;
        setIsSaving(true);
        
        try {
            const projectRef = doc(db, "projects", projectId);
            await updateDoc(projectRef, {
                content: content,
                wordCount: getWordCount(content),
                lastModified: serverTimestamp()
            });

            toast({
                title: "¡Guardado!",
                description: "Tu obra maestra está a salvo.",
            });

        } catch (error) {
            console.error("Error saving project:", error);
            toast({
                variant: "destructive",
                title: "Error al guardar",
                description: "No se pudo guardar tu progreso. Inténtalo de nuevo.",
            });
        } finally {
            setIsSaving(false);
        }
    };


    if (loading || authLoading) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <Skeleton className="h-10 w-48 mb-4" />
                <Skeleton className="h-6 w-32 mb-8" />
                <Skeleton className="w-full h-[60vh]" />
            </div>
        );
    }
    
    if (!project) {
        return null; // or a more specific "not found" component
    }

    return (
        <div className="flex h-screen">
             <SonnerToaster />
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Volver al Escritorio</span>
                        </Link>
                    </Button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-headline text-lg font-semibold truncate">{project.title}</h1>
                        <p className="text-sm text-muted-foreground">{getWordCount(content).toLocaleString()} palabras</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {project.type === "Poesía" && <SyllableCounter lineText={currentLineText} />}
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </header>
                <main className="flex-1 overflow-auto">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Empieza a escribir tu historia aquí..."
                        className="w-full h-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-4 md:p-8 text-base lg:text-lg !bg-background"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            updateCurrentLine();
                        }}
                        onKeyUp={updateCurrentLine}
                        onClick={updateCurrentLine}
                    />
                </main>
            </div>
            {project.type === "Poesía" && <PoetryToolsPanel />}
        </div>
    );
}
