import { Globe2, Settings, WholeWordIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useModelContext } from "@/app/layout"


const gemini_api=process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Menu items.
const models = [
  { title: "DeepSeek-R1 (7B)", action:"deepseek-r1:7b", url: "#" },
  { title: "DeepSeek-R1 (14B)", action:"deepseek-r1:14b", url: "#" },
]

const webModels = [
  {title:"Gemini 1.5 Flash", icon:WholeWordIcon, action:"gemini-1.5 flash", url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gemini_api}`}
]

export function AppSidebar() {
  const {selectedModel, setSelectedModel } = useModelContext()

  return (
    <Sidebar>
      <SidebarHeader className="text-4xl font-mono font-bold m-2 flex-col">truseek<span className="text-xs font-mono">.adith.me</span></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Current Model: {selectedModel}</SidebarGroupLabel>
          <SidebarGroupLabel>Installed models</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {models.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button onClick={() => setSelectedModel(item.action)} className="flex gap-2 items-center">
                        <Settings/>
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Web Models - Use anywhere</SidebarGroupLabel>
          <SidebarGroupContent>
              <SidebarMenu>
                  {webModels.map((item)=>(
                      <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button onClick={() => setSelectedModel(item.action)} className="flex gap-2 items-center">
                          <Globe2/>
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='text-sm text-center my-4'>
      <a href='https://www.adith.me'>created with {"<3"} by adi</a>
      </SidebarFooter>
    </Sidebar>
  )
}
