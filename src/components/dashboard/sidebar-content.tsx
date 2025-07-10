
"use client";

import {
  Book,
  Feather,
  Home,
  Settings,
  Trash2,
  Clapperboard,
  Music,
  Newspaper,
  Notebook
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent as Content,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

export function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');

  const isActive = (path: string, filter?: string | null) => {
    const isPathActive = pathname === path;
    const isFilterActive = typeFilter === filter;
    if (filter === null) { // For "Escritorio" which has no filter
        return isPathActive && !typeFilter;
    }
    return isPathActive && isFilterActive;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary-foreground fill-current" />
            <span className="text-xl font-headline font-semibold">Lienzo</span>
        </div>
      </SidebarHeader>
      <Content>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard", null)} tooltip="Escritorio">
              <Link href="/dashboard">
                <Home />
                Escritorio
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
            <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Novelas" isActive={isActive("/dashboard", "Novela")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Novela' } }}>
                          <Book />
                          Novelas
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Poesía" isActive={isActive("/dashboard", "Poesía")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Poesía' } }}>
                          <Feather />
                          Poesía
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Guiones" isActive={isActive("/dashboard", "Guion")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Guion' } }}>
                          <Clapperboard />
                          Guiones
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Cancioneros" isActive={isActive("/dashboard", "Cancionero")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Cancionero' } }}>
                          <Music />
                          Cancioneros
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Blogs / Ensayos" isActive={isActive("/dashboard", "Blog / Ensayos")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Blog / Ensayos' } }}>
                          <Newspaper />
                          Blogs / Ensayos
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Notas" isActive={isActive("/dashboard", "Notas")}>
                       <Link href={{ pathname: '/dashboard', query: { type: 'Notas' } }}>
                          <Notebook />
                          Notas
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>

      </Content>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Ajustes">
              <Link href="#">
                <Settings />
                Ajustes
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Papelera">
              <Link href="#">
                <Trash2 />
                Papelera
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
