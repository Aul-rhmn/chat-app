"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Send, Loader2, RefreshCw, Moon, Sun, AlertCircle, Server } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: number
  content: string
  username: string
  created_at: string
}

// Mock data for when the API is unavailable
const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    content: "Welcome to the chat app! This is using mock data since the API is unavailable.",
    username: "System",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    content: "You can still test the UI while we work on connecting to the backend.",
    username: "System",
    created_at: new Date().toISOString(),
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [useMockData, setUseMockData] = useState(false)
  const [apiUrl, setApiUrl] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Set a random username on first load with a more interesting name
  useEffect(() => {
    const adjectives = ["Happy", "Clever", "Swift", "Bright", "Calm", "Eager", "Gentle", "Kind"]
    const nouns = ["Panda", "Tiger", "Eagle", "Dolphin", "Fox", "Wolf", "Hawk", "Bear"]

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

    setUsername(`${randomAdjective}${randomNoun}`)

    // Log environment variables for debugging
    console.log("Environment variables:", {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "Not set",
    })

    // Set the API URL with a fallback
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    setApiUrl(url)
    console.log("Using API URL:", url)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Toggle between real API and mock data
  const toggleMockData = () => {
    setUseMockData(!useMockData)
    if (!useMockData) {
      // Switching to mock data
      setMessages(MOCK_MESSAGES)
      setLoading(false)
      setError(null)
      toast({
        title: "Using Mock Data",
        description: "Now using local mock data instead of the API.",
        variant: "default",
      })
    } else {
      // Switching back to real API
      setLoading(true)
      fetchMessages()
    }
  }

  // Fetch messages with better error handling
  const fetchMessages = async () => {
    // If using mock data, don't actually fetch
    if (useMockData) {
      setMessages(MOCK_MESSAGES)
      setLoading(false)
      return
    }

    try {
      setError(null)
      console.log("Fetching messages from:", `${apiUrl}/api/messages`)

      // First try the API route
      const response = await fetch(`/api/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: { revalidate: 0 }, // Disable cache
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received data:", data)
      setMessages(data)
      setLoading(false)

      // Scroll to bottom after messages load
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError(`Error fetching messages: ${err instanceof Error ? err.message : "Unknown error"}`)
      setLoading(false)

      toast({
        title: "Connection Error",
        description: "Could not connect to the chat server. You can use mock data to test the UI.",
        variant: "destructive",
      })
    }
  }

  // Initial fetch and set up polling
  useEffect(() => {
    fetchMessages()

    // Poll for new messages every 5 seconds, but only if not using mock data
    const intervalId = setInterval(() => {
      if (!useMockData) {
        fetchMessages()
      }
    }, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [useMockData])

  // Send a new message with better error handling
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || sending) return

    // If using mock data, just add to the local state
    if (useMockData) {
      const mockMessage: Message = {
        id: Date.now(),
        content: newMessage,
        username: username,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, mockMessage])
      setNewMessage("")

      // Scroll to bottom
      if (scrollAreaRef.current) {
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
          }
        }, 100)
      }

      return
    }

    try {
      setSending(true)

      // First try the API route
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: {
            content: newMessage,
            username: username,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      // Clear the input field
      setNewMessage("")

      // Focus the input field again
      inputRef.current?.focus()

      // Fetch the updated messages
      fetchMessages()
    } catch (err) {
      console.error("Error sending message:", err)

      toast({
        title: "Failed to Send",
        description: "Your message could not be sent. Try using mock data instead.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get a color for the avatar based on username
  const getUserColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-pink-500 to-rose-500",
      "bg-gradient-to-br from-blue-500 to-indigo-500",
      "bg-gradient-to-br from-green-500 to-emerald-500",
      "bg-gradient-to-br from-amber-500 to-orange-500",
      "bg-gradient-to-br from-purple-500 to-violet-500",
      "bg-gradient-to-br from-cyan-500 to-sky-500",
      "bg-gradient-to-br from-red-500 to-pink-500",
      "bg-gradient-to-br from-teal-500 to-emerald-500",
    ]

    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen p-4 transition-colors duration-300",
        darkMode ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-blue-50 to-indigo-50",
      )}
    >
      <Card
        className={cn(
          "w-full max-w-md shadow-xl border-0 overflow-hidden transition-all duration-300",
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white",
        )}
      >
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Real-Time Chat</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMockData}
              className="text-white hover:bg-white/20"
              title={useMockData ? "Switch to API data" : "Switch to mock data"}
            >
              <Server className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-white hover:bg-white/20">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>

        <div className="bg-primary/10 px-4 py-2 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                useMockData ? "bg-yellow-500" : loading ? "bg-amber-500" : error ? "bg-red-500" : "bg-green-500",
              )}
            ></div>
            <span className="font-medium">
              {useMockData ? "Using Mock Data" : loading ? "Connecting..." : error ? "Disconnected" : "Connected"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs opacity-70">Chatting as</span>
            <span className="font-semibold">{username}</span>
          </div>
        </div>

        <ScrollArea
          className={cn("h-[400px] p-4 transition-colors duration-300", darkMode ? "bg-gray-800" : "bg-white")}
          ref={scrollAreaRef}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full gap-3">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-destructive text-center">{error}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchMessages} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
                <Button variant="default" size="sm" onClick={toggleMockData} className="gap-2">
                  <Server className="h-4 w-4" />
                  Use Mock Data
                </Button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn("flex gap-3", message.username === username ? "flex-row-reverse" : "")}
                  >
                    <Avatar
                      className={cn("h-8 w-8 ring-2 ring-white dark:ring-gray-800", getUserColor(message.username))}
                    >
                      <AvatarFallback className="text-white font-medium">
                        {message.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                        message.username === username
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-100",
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            message.username === username ? "text-indigo-100" : "text-primary",
                          )}
                        >
                          {message.username === username ? "You" : message.username}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            message.username === username ? "text-indigo-200" : "text-muted-foreground",
                          )}
                        >
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>

        <CardFooter
          className={cn(
            "border-t p-3 transition-colors duration-300",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white",
          )}
        >
          <form onSubmit={sendMessage} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={cn("flex-1 transition-colors duration-300", darkMode ? "bg-gray-700 border-gray-600" : "")}
              disabled={loading && !useMockData}
            />
            <Button
              type="submit"
              disabled={((loading || !!error) && !useMockData) || !newMessage.trim() || sending}
              className="gap-2 transition-all duration-200 hover:shadow-md"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

