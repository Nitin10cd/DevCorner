"use client"
import { createContext, useContext, useState, ReactNode } from "react"

type SidebarContextType = {
  activeState: string
  setActiveState: (state: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProviderContext = ({ children }: { children: ReactNode }) => {
  const [activeState, setActiveState] = useState("Home")

  return (
    <SidebarContext.Provider value={{ activeState, setActiveState }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
