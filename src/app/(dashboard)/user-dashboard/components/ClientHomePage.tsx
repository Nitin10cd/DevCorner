"use client"
import { useSidebar } from "@/context/SidebarContext";

export default function ClientPage({name}: {name : string}){
    const {activeState} = useSidebar();
    return (
        <>
        <p>Current User :{name}</p>
        <p>Active State: {activeState}</p>
        </>
    )
}