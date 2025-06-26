"use client";

import { useSidebar } from "@/context/SidebarContext";
import UserProfilePage from "./ProfilePage";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientPage() {
  const { data: session, status } = useSession();
  const { activeState } = useSidebar();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      setRole(session.user.role);
    }
  }, [status, session]);

  useEffect(() => {
    if (role === "USER" && activeState === "blog") {
      router.push("/blog");
    }
  }, [role, activeState, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return <p>Please log in to continue.</p>;

  if (role !== "USER") return <p>You are not authorized to access this content.</p>;

  if (activeState === "blog") return null;

  return (
    <>
      {activeState === "Profile" ? (
        <UserProfilePage />
      ) : (
        <p>Hello Another Page</p>
      )}
    </>
  );
}
