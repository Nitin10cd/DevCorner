import { SidebarProvider , SidebarTrigger  } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/sidebar";
import { SidebarProviderContext } from "@/context/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
       <SidebarProviderContext>
         <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 bg-muted/10 p-6">
                <SidebarTrigger />
                    {children}
                </main>
        </SidebarProvider>
       </SidebarProviderContext>
    )
}
