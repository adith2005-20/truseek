'use client'
import { createContext, useState, useContext } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {Geist} from 'next/font/google'
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  //👇 Add variable to our object
  variable: '--font-opensans',
})


// Create a context for the selected model
const ModelContext = createContext()

export default function Layout({ children }) {
  const [selectedModel, setSelectedModel] = useState("deepseek-r1:7b")

  return (
    <html className={geist.className}>
      <body className="flex h-screen bg-background text-foreground ">
        <SidebarProvider>
          {/* Provide the selected model and updater */}
          <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
            <AppSidebar />
            <main>
              
              {children}
            </main>
          </ModelContext.Provider>
        </SidebarProvider>
      </body>
    </html>
  )
}

// Export context for other components to use
export function useModelContext() {
  return useContext(ModelContext)
}
