"use client";
import React, { useEffect, useState, useRef } from "react";
import "./globals.css";
import { Input } from "@/components/ui/input";
import { Moon, Send, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import { useModelContext } from "./layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const [messageBox, setMessageBox] = useState([]);
  const [senderStringMessage, setSenderStringMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef(null);
  const [loading, setLoading]=useState(false);

  const { selectedModel } = useModelContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!senderStringMessage.trim()) return;
    const userMessage = { text: senderStringMessage, sender: "You" };
    setMessageBox((prev) => [...prev, userMessage]);
    setSenderStringMessage("");
    let botMessage;
    try {
      console.log(selectedModel);
      if (selectedModel.startsWith("gemini") || selectedModel.startsWith("gpt")) {
        const response = await fetch("/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: {
                model: selectedModel,
                text: senderStringMessage,
              },
            }),
          }
        )
        const responseData = await response.json(); // Parse JSON response
        botMessage = {text: responseData.text, sender: "TruSeek"}
      } else {
        const res = await axios.post("http://localhost:11434/api/generate", {
          model: selectedModel,
          prompt: senderStringMessage,
          stream: false,
        });
        botMessage = { text: res.data.response, sender: "TruSeek" };
      }
      setMessageBox((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      botMessage = { text: "Error: Unable to process request.", sender: "TruSeek" };
      setMessageBox((prev) => [...prev, botMessage]);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageBox]);

  const onDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="bg-background text-foreground flex w-full h-screen">
  {/* Mobile Header */}
  <div className="lg:hidden fixed top-0 left-0 w-full flex items-center justify-between p-2 bg-sidebar z-50 shadow">
    <SidebarTrigger className="scale-125 bg-sidebar p-2 m-2 shadow" />
    <span className="font-mono text-2xl text-sidebar-foreground">truseek</span>
    <button className="rounded-full shadow p-2 bg-sidebar" onClick={onDarkModeToggle}>
      {darkMode ? <Sun /> : <Moon />}
    </button>
  </div>

  {/* Sidebar (Visible in Larger Screens) */}
  <SidebarTrigger className="hidden lg:block scale-125 bg-sidebar p-2 m-2 mt-3 shadow z-50" />

  {/* Theme Changer Button for Larger Screens */}
  <button
    className="hidden lg:block fixed top-1 right-2 rounded-full shadow p-1 bg-sidebar z-50 m-2"
    onClick={onDarkModeToggle}
  >
    {darkMode ? <Sun /> : <Moon />}
  </button>

  {/* Main Content Wrapper */}
  <div className="flex flex-col lg:ml-[1rem] w-full transition-all h-full overflow-hidden chatcontainer">
    {/* Chat Messages */}
    <div ref={chatContainerRef} className="overflow-y-auto p-2 space-y-4 w-full flex-1 mt-20 pb-36 h-full">
      {messageBox.length === 0 && <p className="text-center">Type to chat with TruSeek</p>}
      {messageBox.map((msg, index) => (
        <div key={index} className={`flex items-start ${msg.sender === "You" ? "flex-row-reverse" : ""}`}>
          <User className="border-primary p-2 scale-125 bg-input rounded-full mt-2" />
          <div className={`p-2 mx-4 rounded-lg max-w-[75%] breakwords ${
              msg.sender === "You" ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" : "bg-secondary text-foreground mr-auto rounded-tl-none"
            }`}
          >
            <strong>{msg.sender}:{"\n"}</strong> <Markdown
            components={{
              code({ node, inline, className, children, ...props }) {
                return (
                  <code
                    className={`${className} break-words`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
            >{msg.text}</Markdown>
          </div>
        </div>
      ))}
    </div>

    {/* Input Field */}
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex w-11/12 max-w-2xl items-center space-x-3 z-50 bg-input text-foreground p-2 rounded-xl shadow-lg transition-all lg:ml-[8rem]">
      <form className="flex w-full items-center space-x-3" onSubmit={handleSubmit}>
        <Input
          type="text"
          className="h-12 flex-1 p-4 text-lg border border-primary rounded-xl focus:outline-none focus:ring-2 focus:border-accent"
          placeholder="Ask TruSeek..."
          value={senderStringMessage}
          onChange={(e) => setSenderStringMessage(e.target.value)}
        />
        <Button type="submit" className="h-12 w-14 flex items-center justify-center bg-primary text-primary-foreground rounded-xl">
          <Send size={24} />
        </Button>
      </form>
    </div>
  </div>
</div>


  );
};

export default Page;
