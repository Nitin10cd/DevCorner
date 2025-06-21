import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function UserHomePage () {
    // const renderOptions = []
    const session = await getServerSession(authOptions);
    if (!session) redirect('/sign-in')
    return (
        <div>
            Welcome to the User Dashboard {session.user.name}
            hello
        </div>
    )
}