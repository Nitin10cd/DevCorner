import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import ClientPage from "./user-dashboard/components/ClientHomePage";

export default async function DashboardHomepage () {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/sign-in');
    if (session.user.role === "USER") redirect("/user-dashboard");
    else redirect("/recruiter-dashboard")
    return (
        <div>
            <ClientPage />
        </div>
    )
}

