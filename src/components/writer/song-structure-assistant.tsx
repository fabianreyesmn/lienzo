
"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ArrowUp, ArrowDown, Trash2, GitCommitHorizontal } from 'lucide-react';

const sectionTypes = ["Verso", "Estribillo", "Puente", "Intro", "Outro", "Pre-Estribillo", "Solo"];

interface SongSection {
    id: string;
    type: string;
    content: string;
}

interface SongStructureAssistantProps {
    initialContent: string;
    onStructureChange: (newContent: string) => void;
}

export function SongStructureAssistant({ initialContent, onStructureChange }: SongStructureAssistantProps) {
    const [sections, setSections] = useState<SongSection[]>([]);

    useEffect(() => {
        // This effect runs only once on mount to parse initial content
        const parsedSections = parseContentToSections(initialContent);
        setSections(parsedSections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const parseContentToSections = (content: string): SongSection[] => {
        if (!content.trim()) return [];

        const lines = content.split('\n');
        const newSections: SongSection[] = [];
        let currentSection: SongSection | null = null;

        const typeRegex = new RegExp(`^\\[(${sectionTypes.join('|')})(?: (\\d+))?\\]$`);

        for (const line of lines) {
            const match = line.match(typeRegex);
            if (match) {
                if (currentSection) {
                    currentSection.content = currentSection.content.trim();
                    newSections.push(currentSection);
                }
                currentSection = { id: uuidv4(), type: match[1], content: '' };
            } else if (currentSection) {
                currentSection.content += line + '\n';
            }
        }
        if (currentSection) {
            currentSection.content = currentSection.content.trim();
            newSections.push(currentSection);
        }
        
        return newSections;
    };


    const updateEditorContent = (updatedSections: SongSection[]) => {
        const newContent = updatedSections.map(section => {
            const header = `[${section.type}]`;
            return `${header}\n${section.content}`;
        }).join('\n\n');
        onStructureChange(newContent);
    };

    const handleAddSection = () => {
        const newSection: SongSection = { id: uuidv4(), type: 'Verso', content: '' };
        const updatedSections = [...sections, newSection];
        setSections(updatedSections);
    };
    
    const handleUpdateSection = (id: string, newContent: Partial<SongSection>) => {
        const updatedSections = sections.map(s => s.id === id ? { ...s, ...newContent } : s);
        setSections(updatedSections);
    };
    
    const handleDeleteSection = (id: string) => {
        const updatedSections = sections.filter(s => s.id !== id);
        setSections(updatedSections);
        updateEditorContent(updatedSections);
    };
    
    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newSections.length) {
            [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
            setSections(newSections);
            updateEditorContent(newSections);
        }
    };
    
    const handleSyncToEditor = () => {
        updateEditorContent(sections);
        toast.success("Estructura sincronizada con el editor.");
    }
    
    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold">Asistente de Estructura</CardTitle>
                <CardDescription className="text-xs">
                    Organiza las partes de tu canción.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                    {sections.map((section, index) => (
                        <Card key={section.id} className="p-3 bg-background/70">
                            <div className="flex items-center gap-2 mb-2">
                                <Select 
                                    value={section.type} 
                                    onValueChange={(type) => handleUpdateSection(section.id, { type })}
                                >
                                    <SelectTrigger className="flex-1 h-8">
                                        <SelectValue placeholder="Tipo de sección" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectionTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="flex">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveSection(index, 'up')} disabled={index === 0}>
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMoveSection(index, 'down')} disabled={index === sections.length - 1}>
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteSection(section.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                placeholder={`Letra para ${section.type.toLowerCase()}...`}
                                value={section.content}
                                onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                                className="min-h-[80px] text-sm"
                            />
                        </Card>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAddSection} variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Añadir Sección
                    </Button>
                    <Button onClick={handleSyncToEditor} className="w-full">
                        <GitCommitHorizontal className="mr-2 h-4 w-4" /> Sincronizar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
