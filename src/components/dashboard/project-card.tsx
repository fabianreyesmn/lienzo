
import Image from "next/image";
import { Book, Feather, Clapperboard, Music, Newspaper, Notebook, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { Project, EditableProject } from "@/app/dashboard/page";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectAlert } from "./delete-project-alert";

const typeIcons: { [key: string]: React.ReactNode } = {
  "Novela": <Book className="h-4 w-4 text-muted-foreground" />,
  "Poesía": <Feather className="h-4 w-4 text-muted-foreground" />,
  "Guion": <Clapperboard className="h-4 w-4 text-muted-foreground" />,
  "Cancionero": <Music className="h-4 w-4 text-muted-foreground" />,
  "Blog / Ensayos": <Newspaper className="h-4 w-4 text-muted-foreground" />,
  "Notas": <Notebook className="h-4 w-4 text-muted-foreground" />,
};

function formatLastModified(date: any) {
  if (!date) return 'Desconocido';
  // Firestore Timestamps can be converted to JS Date objects
  const jsDate = date.toDate ? date.toDate() : new Date(date);
  return formatDistanceToNow(jsDate, { addSuffix: true, locale: es });
}

interface ProjectCardProps {
  project: Project;
  onProjectUpdate: (project: EditableProject) => void;
  onProjectDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onProjectUpdate, onProjectDelete }: ProjectCardProps) {
  const progress = project.goal > 0 ? (project.wordCount / project.goal) * 100 : 0;
  
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/writer/${project.id}`} className="block">
          <Image
            src={`https://placehold.co/400x250.png`}
            data-ai-hint={project.coverHint}
            alt={`Portada de ${project.title}`}
            width={400}
            height={250}
            className="w-full h-32 object-cover"
          />
        </Link>
         <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-card/70 hover:bg-card">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opciones del proyecto</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={stopPropagation}>
              <EditProjectDialog project={project} onProjectUpdate={onProjectUpdate}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4"/>
                  Editar
                </DropdownMenuItem>
              </EditProjectDialog>
              <DeleteProjectAlert onConfirmDelete={() => onProjectDelete(project.id)}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                  <Trash2 className="mr-2 h-4 w-4"/>
                  Eliminar
                </DropdownMenuItem>
              </DeleteProjectAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <Link href={`/writer/${project.id}`} className="flex flex-col flex-grow">
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {typeIcons[project.type]}
            <p className="text-sm text-muted-foreground">{project.type}</p>
          </div>
          <CardTitle className="text-lg font-headline leading-tight mb-2 group-hover:text-primary-foreground transition-colors">{project.title}</CardTitle>
          <CardDescription className="text-xs">
            Modificado: {formatLastModified(project.lastModified)}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {project.goal > 0 ? (
            <div className="w-full">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{project.wordCount.toLocaleString()} palabras</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
             <div className="text-xs text-muted-foreground">
                {project.wordCount.toLocaleString()} palabras
             </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
