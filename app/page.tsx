"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Plus } from "lucide-react"
import type { CouncilResponse, Message } from "@/lib/types"
import ChatMessage from "@/components/chat-message"
import CouncilReview from "@/components/council-review"

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      const data: CouncilResponse = await response.json()

      const assistantMessage: Message = {
        id: Date.now().toString() + "1",
        role: "assistant",
        content: data.finalResponse,
        councilData: data,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const newChat = () => {
    setMessages([])
    setInput("")
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-64 border-r border-border bg-card md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Button onClick={newChat} variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length > 0 && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Today</div>
          )}
          {messages
            .filter((m) => m.role === "user")
            .slice(-5)
            .map((msg) => (
              <div
                key={msg.id}
                className="text-sm text-muted-foreground truncate p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
              >
                {msg.content.slice(0, 30)}...
              </div>
            ))}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-border px-4 py-3 sm:px-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">LLM Council</h1>
            <p className="text-xs text-muted-foreground">Powered by Vercel AI Gateway</p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:px-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-6 py-12 text-center">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">LLM Council</h2>
                  <p className="text-base text-muted-foreground max-w-md">
                    Ask a question and watch GPT-4, Claude, Gemini, and Grok discuss and reach consensus through
                    Vercel's AI Gateway
                  </p>
                </div>
                <div className="grid gap-3 pt-4 w-full max-w-sm">
                  <div className="rounded-lg border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Example prompts:</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li>"Explain quantum computing simply"</li>
                      <li>"What are best practices for API design?"</li>
                      <li>"How should I structure my Next.js project?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <ChatMessage message={message} />
                  {message.councilData && <CouncilReview councilData={message.councilData} />}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="border-t border-border bg-background px-4 py-4 sm:px-6">
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message LLM Council..."
                className="resize-none bg-card border-border rounded-lg"
                rows={3}
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="lg"
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  )
}
