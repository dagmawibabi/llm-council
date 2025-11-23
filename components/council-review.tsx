"use client"

import { useState } from "react"
import type { CouncilResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function CouncilReview({
  councilData,
}: {
  councilData: CouncilResponse
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-3 pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        <span>Council Discussion</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {expanded && (
        <div className="space-y-3 pl-4 border-l border-border">
          {/* Individual Model Responses */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Council Members</p>
            <div className="grid gap-2">
              {councilData.councilResponses.map((response, idx) => (
                <div key={idx} className="bg-muted/30 border border-border rounded-lg p-3">
                  <p className="text-xs font-semibold text-primary mb-2">{response.modelLabel}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{response.response}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Review Analysis */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Review & Analysis</p>
            <div className="bg-muted/30 border border-border rounded-lg p-3">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{councilData.review}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
