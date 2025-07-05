"use client";
import { useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import {
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  ChevronUp,
  ComputerIcon,
  BellIcon,
  Users as GroupIcon,
  FileText,
  User2Icon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", state: "home", icon: Home },
  { title: "Profile", state: "profile", icon: User2Icon },
  { title: "Messages", state: "messages", icon: Inbox },
  { title: "Jobs", state: "jobs", icon: Search },
  { title: "Blogs", state: "blog", icon: FileText },
  { title: "Projects Showcase", state: "projects", icon: ComputerIcon },
  { title: "Connections", state: "connections", icon: GroupIcon },
  { title: "Notifications", state: "notification", icon: BellIcon },
  { title: "Settings", state: "setting", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { activeState, setActiveState } = useSidebar();

  const changeState = (title: string, state: string) => {
    setActiveState(state);
  };

  useEffect(() => {
    if (activeState === "jobs") {
      router.push("/jobs");
    }
  }, [activeState]);

  return (
    <Sidebar className="bg-[#0f0f11] border-r border-[#2e2e33] text-[#f5f3f7] shadow-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-rose-400 font-bold text-lg px-6 pt-6 pb-3">
            ByteBoard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.state);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <p
                        onClick={() => changeState(item.title, item.state)}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 text-base font-medium
                          ${
                            isActive
                              ? "bg-rose-500 text-white"
                              : "text-zinc-300 hover:bg-[#1f1f23] hover:text-rose-400"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </p>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#2e2e33] px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#1f1f23] text-zinc-300">
                  <div className="flex items-center gap-3">
                    <User2 className="w-5 h-5" />
                    <span className="text-base font-medium">
                      {session?.user?.name ?? "Username"}
                    </span>
                  </div>
                  <ChevronUp className="w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-full bg-[#1f1f23] border border-[#2e2e33] text-zinc-100 shadow-lg"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-[#2e2e33] px-4 py-2 text-sm">
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#2e2e33] px-4 py-2 text-sm">
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer hover:bg-[#2e2e33] px-4 py-2 text-sm text-rose-400"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
