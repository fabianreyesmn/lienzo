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
            <Link href="/dashboard" legacyBehavior passHref>
              <SidebarMenuButton isActive={isActive("/dashboard")} tooltip="Escritorio">
                <Home />
                Escritorio
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
            <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="#" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Novelas">
                            <Book />
                            Novelas
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="#" legacyBehavior passHref>
                        <SidebarMenuButton tooltip="Poesía">
                            <Feather />
                            Poesía
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
            <Link href="#" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Ajustes">
                <Settings />
                Ajustes
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="#" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Papelera">
                <Trash2 />
                Papelera
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
