import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GlobalHomePage from "@/components/Global/GlobalHomePage";

export default async function Home () {
  const session = await getServerSession(authOptions);
  if (!session) return <GlobalHomePage/>
  if (session.user.role === "USER") redirect("/user-dashboard");
  else redirect("/recruiter-dashboard");
  return (
    <div> Home Page </div>
  )
}