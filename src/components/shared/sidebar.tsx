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
  { title: "Home", state : "home", icon: Home },
  { title: "Profile",  state : "profile", icon: User2Icon },
  { title: "Messages", state : "messages", icon: Inbox },
  { title: "Jobs", state : "jobs", icon: Search },
  { title: "Blogs",  state : "blog", icon: FileText },
  { title: "Projects Showcase",  state : "projects", icon: ComputerIcon },
  { title: "Connections", state : "connections", icon: GroupIcon },
  { title: "Notifications",  state : "notification", icon: BellIcon },
  { title: "Settings",  state : "setting", icon: Settings },
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
    router.push('/jobs');
   }
  }, [activeState])
  

  return (
    <Sidebar className="bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 text-gray-900 shadow-sm">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-semibold text-md px-6 pt-6 pb-2">
            ByteBoard
          </SidebarGroupLabel>
          <br />
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.state);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <p
                        onClick={() => changeState(item.title, item.state)}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 text-base font-semibold ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="w-6 h-6" />
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

      <SidebarFooter className="border-t border-gray-200 px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700">
                  <div className="flex items-center gap-3">
                    <User2 className="w-6 h-6" />
                    <span className="text-base font-medium">
                      {session?.user?.name ?? "Username"}
                    </span>
                  </div>
                  <ChevronUp className="w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-full bg-white border border-gray-200 shadow-md rounded-md"
              >
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm">
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm">
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-red-500"
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
