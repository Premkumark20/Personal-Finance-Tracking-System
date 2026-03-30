import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DatabaseManager } from "@/components/DatabaseManager";
import { Download } from "lucide-react";
import { exportAllToExcel } from "@/lib/exportUtils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-2">
            <SidebarTrigger />
            <div className="ml-3 flex items-center gap-2">
              <img 
                src="/finance-logo.svg" 
                alt="Finance Dashboard" 
                className="h-5 w-5"
              />
              <span className="text-sm font-semibold text-muted-foreground">
                Personal Finance Tracking System
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => exportAllToExcel()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground transition-fast"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <DatabaseManager />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
