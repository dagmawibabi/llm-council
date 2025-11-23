"use client";

import type { Message } from "@/lib/types";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-bl-none"
            : "bg-card text-card-foreground border border-border rounded-tl-none"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed prose-p:m-0 prose-p:mb-2 prose-headings:mt-3 prose-headings:mb-2 prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-a:text-primary hover:prose-a:underline">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
