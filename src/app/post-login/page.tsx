"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "RECRUITER") {
        router.replace("/recruiter-dashboard");
      } else {
        router.replace("/user-dashboard");
      }
    }
  }, [session, status, router]);

  return <p>Redirecting Based On Role...</p>;
}
