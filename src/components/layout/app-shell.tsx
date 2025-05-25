
"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '../ui/button'; // Keep for other potential uses, though not for SidebarTrigger child here
import { PanelLeft } from 'lucide-react'; // Keep for other potential uses

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <SidebarNav />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
            {/* Mobile Header Content - Trigger for Sidebar */}
            <SidebarTrigger
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            />
            <div className="font-semibold">DairyConnect</div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
