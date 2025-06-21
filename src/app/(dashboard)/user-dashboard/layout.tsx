// app/(dashboard)/user-dashboard/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/shared/sidebar"

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 bg-muted/10 p-6">
                <SidebarTrigger />
                {children}</main>
        </SidebarProvider>
    )
}
