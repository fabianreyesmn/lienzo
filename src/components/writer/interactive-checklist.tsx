
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Task {
  text: string;
  checked: boolean;
  originalIndex: number;
}

interface InteractiveChecklistProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

export function InteractiveChecklist({ content, onContentChange }: InteractiveChecklistProps) {

  const tasks = useMemo((): Task[] => {
    return content
      .split('\n')
      .map((line, index) => {
        const match = line.match(/^\[( |x)\]\s*(.*)/i);
        if (match) {
          return {
            text: match[2],
            checked: match[1].toLowerCase() === 'x',
            originalIndex: index,
          };
        }
        return null;
      })
      .filter((task): task is Task => task !== null);
  }, [content]);

  const handleToggleTask = (taskIndex: number, newCheckedState: boolean) => {
    const lines = content.split('\n');
    const originalLineIndex = tasks[taskIndex].originalIndex;
    const currentLine = lines[originalLineIndex];

    const newMarker = newCheckedState ? '[x]' : '[ ]';
    lines[originalLineIndex] = currentLine.replace(/^\[( |x)\]/i, newMarker);

    onContentChange(lines.join('\n'));
  };

  return (
    <Card className="bg-background/50">
      <CardContent className="p-2">
        <ScrollArea className="h-48 w-full rounded-md border">
          {tasks.length > 0 ? (
            <div className="p-4 space-y-3">
              {tasks.map((task, index) => (
                <div key={`${task.originalIndex}-${task.text}`} className="flex items-center space-x-3">
                  <Checkbox
                    id={`task-${task.originalIndex}`}
                    checked={task.checked}
                    onCheckedChange={(checked) => handleToggleTask(index, !!checked)}
                  />
                  <label
                    htmlFor={`task-${task.originalIndex}`}
                    className={`text-sm leading-none ${task.checked ? 'line-through text-muted-foreground' : ''} peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                  >
                    {task.text}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground p-4 text-center">
              Escribe `[ ]` seguido de una tarea en el editor para que aparezca aquí.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
