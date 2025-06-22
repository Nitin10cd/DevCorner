"use client"
import { useSidebar } from "@/context/SidebarContext";
import UserProfilePage from "./ProfilePage";

export default function ClientPage(){
    const {activeState} = useSidebar();
    return (
        <>
        {activeState === "Profile" ? <UserProfilePage/> : <p> Hello Another Page</p>}
        </>
    )
}