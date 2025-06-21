import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import ClientPage from "./components/ClientHomePage";

export default async function UserHomePage () {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/sign-in')
    return (
        <div>
            <ClientPage name = {session.user.name ?? "User" }/>
        </div>
    )
}