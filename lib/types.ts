export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  councilData?: CouncilResponse
}

export interface CouncilResponse {
  query: string
  councilResponses: Array<{
    model: string
    response: string
    modelLabel: string
  }>
  review: string
  finalResponse: string
}

export interface ModelConfig {
  id: string
  name: string
  label: string
  provider: string
}
