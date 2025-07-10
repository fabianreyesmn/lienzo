
"use client";

import {
  Book,
  Feather,
  Home,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

  const isActive = (path: string) => {
    return pathname === path;
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
            <Link href="/dashboard" passHref>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Escritorio">
                <Link href="/dashboard">
                  <Home />
                  Escritorio
                </Link>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
            <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="#" passHref>
                        <SidebarMenuButton asChild tooltip="Novelas">
                           <Link href="#">
                              <Book />
                              Novelas
                           </Link>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="#" passHref>
                        <SidebarMenuButton asChild tooltip="Poesía">
                           <Link href="#">
                              <Feather />
                              Poesía
                           </Link>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>

      </Content>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="#" passHref>
              <SidebarMenuButton asChild tooltip="Ajustes">
                <Link href="#">
                  <Settings />
                  Ajustes
                </Link>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="#" passHref>
              <SidebarMenuButton asChild tooltip="Papelera">
                <Link href="#">
                  <Trash2 />
                  Papelera
                </Link>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
