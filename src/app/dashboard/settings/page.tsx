
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { ThemeSwitcher } from "@/components/dashboard/theme-switcher";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile(user, { displayName });
      toast({
        title: "¡Perfil actualizado!",
        description: "Tu nombre ha sido cambiado con éxito.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-card px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
              <h1 className="font-headline text-lg font-semibold">Ajustes</h1>
          </div>
          <div className="flex items-center gap-4">
              <UserNav />
          </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Perfil</CardTitle>
                    <CardDescription>
                        Así es como te verás en Lienzo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="displayName">Nombre</Label>
                            <Input 
                                id="displayName" 
                                type="text" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Tu nombre"
                                required 
                            />
                        </div>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Apariencia</CardTitle>
                    <CardDescription>
                        Elige el ambiente que más te inspire.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeSwitcher />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
