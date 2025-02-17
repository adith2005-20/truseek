"use client";
import React, { useEffect, useState, useRef } from "react";
import "./globals.css";
import { Input } from "@/components/ui/input";
import { Moon, Send, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Markdown from "react-markdown";
import { useModelContext } from "./layout";

const Page = () => {
  const [messageBox, setMessageBox] = useState([]);
  const [senderStringMessage, setSenderStringMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef(null);
  const { selectedModel } = useModelContext();
  const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page refresh

    if (!senderStringMessage.trim()) return; // Prevent empty messages
    const userMessage = { text: senderStringMessage, sender: "You" };
    setMessageBox((prev) => [...prev, userMessage]);
    setSenderStringMessage(""); // Clear input after sending

    let botMessage;
    try {
      console.log(selectedModel);
      if (selectedModel === "gemini-1.5 flash") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apikey}`;
        console.log(url);
        const res = await axios.post(
          url,
          {
            contents: [{ parts: [{ text: senderStringMessage }] }],
          },
          { headers: { "Content-Type": "application/json" } }
        );
        botMessage = { text: res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response", sender: "TruSeek" };
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

  // Scroll to the bottom whenever messageBox updates
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
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      <div id="chatpage" className="flex flex-1 flex-col justify-between w-full mx-4 overflow-hidden">
        {/* Dark Mode Toggle */}
        <button
          className="fixed top-4 right-4 rounded-full shadow p-2 bg-background transition z-50"
          onClick={onDarkModeToggle}
        >
          {darkMode ? <Sun className="text-yellow-600" /> : <Moon className="text-blue-600" />}
        </button>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="overflow-y-auto p-4 space-y-4 w-full flex-1 mt-8 pb-40">
          {messageBox.length === 0 && <p className="text-center">Type to chat with TruSeek</p>}
          {messageBox.map((msg, index) => (
            <div key={index} className={`flex items-start ${msg.sender === "You" ? "flex-row-reverse" : ""}`}>
              <User className="border-primary p-2 scale-125 bg-input rounded-full mt-2" />
              <div className={`p-2 mx-4 rounded-lg max-w-[65%] break-words ${
                  msg.sender === "You" ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" : "bg-secondary text-foreground mr-auto rounded-tl-none"
                }`}
              >
                <strong>{msg.sender}:</strong> <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex w-2/3 max-w-2xl items-center space-x-3 z-50 bg-input text-foreground p-2 rounded-xl shadow-lg mx-4 sm:w-11/12">
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
