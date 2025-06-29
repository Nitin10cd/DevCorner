"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function JobPage() {
    const { data: session, status } = useSession();
    const { activeState } = useSidebar();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.role) {
            setRole(session.user.role);
        }
    }, [status, session]);

    useEffect(() => {
        if ((role === "USER" || role === "RECRUITER") && activeState === "blog") {
            router.push("/blog");
        }
        else if ((role === "USER" || role === "RECRUITER") && activeState === "profile") {
            if (role === "USER") router.push('/user-dashboard');
            else router.push('/recruiter-dashboard')
        }
        else if ((role === "USER" || role === "RECRUITER") && activeState === "projects") {
            router.push("/projects");
        }
        else if ((role === "USER" || role === "RECRUITER") && activeState === "connections") {
            router.push("/connections");
        }
        else if ((role === "USER" || role === "RECRUITER") && activeState === "setting") {
            router.push("/settings");
        }
    }, [role, activeState, router]);

    // --- Handle Loading ---
    if (status === "loading") return <p>Loading...</p>;

    // --- If Not Logged In ---
    if (!session) return <p>Please log in to continue.</p>;
    return (<>
        Job Page
    </>)
}