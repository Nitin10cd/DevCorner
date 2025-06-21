import Providers from "./providers"; // path to the above client component
import "./globals.css";
import  {SidebarProvider , SideBarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/com"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
