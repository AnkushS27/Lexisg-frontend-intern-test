"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, FileText, ExternalLink, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Citation {
  text: string
  source: string
  link: string
  paragraph?: string
}

interface ChatMessage {
  type: "user" | "assistant"
  content: string
  citations?: Citation[]
}

export default function App() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)

  // Simulated API response
  const simulatedResponse = {
    answer:
      "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased's annual income should be added as future prospects.",
    citations: [
      {
        text: "as the age of the deceased at the time of accident was held to be about 54-55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.",
        source: "Dani_Devi_v_Pritam_Singh.pdf",
        link: "https://lexisingapore-my.sharepoint.com/:b:/g/personal/harshit_lexi_sg/EdOegeiR_gdBvQxdyW4xE6oBCDgj5E4Bo5wjvhPHpqgIuQ?e=TEu4vz",
        paragraph: "Para 7",
      },
    ],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      type: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setQuery("")

    // Simulate API call delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        type: "assistant",
        content: simulatedResponse.answer,
        citations: simulatedResponse.citations,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!query.trim() || isLoading) return

      // Create a synthetic form event
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent

      handleSubmit(syntheticEvent)
    }
  }

  const handleCitationClick = (citation: Citation) => {
    // Only show the dialog, don't open PDF automatically
    setSelectedCitation(citation)
  }

  const handlePdfOpen = (citation: Citation, e: React.MouseEvent) => {
    // Prevent event bubbling to avoid opening dialog
    e.stopPropagation()
    // Open PDF in new tab
    window.open(citation.link, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Lexi Legal Assistant</h1>
          <p className="text-gray-600 mt-1">Ask legal questions and get answers with citations</p>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Lexi Legal Assistant</h2>
            <p className="text-gray-500 mb-6">Ask a legal question to get started</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800 font-medium mb-2">Try this example:</p>
              <p className="text-sm text-blue-700">
                "In a motor accident claim where the deceased was self-employed and aged 54–55 years at the time of
                death, is the claimant entitled to an addition towards future prospects in computing compensation under
                Section 166 of the Motor Vehicles Act, 1988?"
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-3xl ${message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"} rounded-lg p-4 shadow-sm`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Citations:</h4>
                  {message.citations.map((citation, citationIndex) => (
                    <Card
                      key={citationIndex}
                      className="mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleCitationClick(citation)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 mb-2">"{citation.text}"</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {citation.paragraph}
                              </Badge>
                              <span className="text-xs text-gray-500">{citation.source}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 flex-shrink-0 hover:bg-blue-100"
                            onClick={(e) => handlePdfOpen(citation, e)}
                          >
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-gray-600">Analyzing your legal question...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Panel */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a legal question..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!query.trim() || isLoading} className="px-6">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line • Citations link to original documents
          </p>
        </div>
      </div>

      {/* Citation Dialog */}
      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Citation Details</DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Source:</h4>
                <p className="text-sm text-gray-600">{selectedCitation.source}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Reference:</h4>
                <Badge variant="secondary">{selectedCitation.paragraph}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quoted Text:</h4>
                <p className="text-sm text-gray-700 italic">"{selectedCitation.text}"</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => window.open(selectedCitation.link, "_blank")}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open PDF Document
                </Button>
                <Button variant="outline" onClick={() => setSelectedCitation(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
