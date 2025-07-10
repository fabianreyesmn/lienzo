import Image from "next/image";
import { Book, Feather, Clapperboard, Music, Newspaper, Notebook } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  type: string;
  wordCount: number;
  goal: number;
  lastModified: string;
  coverHint: string;
};

const typeIcons: { [key: string]: React.ReactNode } = {
  "Novela": <Book className="h-4 w-4 text-muted-foreground" />,
  "Poesía": <Feather className="h-4 w-4 text-muted-foreground" />,
  "Guion": <Clapperboard className="h-4 w-4 text-muted-foreground" />,
  "Cancionero": <Music className="h-4 w-4 text-muted-foreground" />,
  "Blog / Ensayos": <Newspaper className="h-4 w-4 text-muted-foreground" />,
  "Notas": <Notebook className="h-4 w-4 text-muted-foreground" />,
};

export function ProjectCard({ project }: { project: Project }) {
  const progress = project.goal > 0 ? (project.wordCount / project.goal) * 100 : 0;

  return (
    <Link href="#" className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <Image
            src={`https://placehold.co/400x250.png`}
            data-ai-hint={project.coverHint}
            alt={`Portada de ${project.title}`}
            width={400}
            height={250}
            className="w-full h-32 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {typeIcons[project.type]}
            <p className="text-sm text-muted-foreground">{project.type}</p>
          </div>
          <CardTitle className="text-lg font-headline leading-tight mb-2">{project.title}</CardTitle>
          <CardDescription className="text-xs">
            Modificado: {project.lastModified}
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
      </Card>
    </Link>
  );
}
