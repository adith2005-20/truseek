import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({children}) {
  return (
    <html><body className="flex h-screen bg-background text-foreground">
    <SidebarProvider>
      <AppSidebar />
      
      <main className="bg-background text-foreground overflow-y-hidden">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </body></html>
  )
}
