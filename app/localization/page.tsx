"use client"

import { useState } from "react"
import LocalizationRequestForm from "@/components/LocalizationRequestForm"
import LocalizationResults from "@/components/LocalizationResults"
import { LocalizationRequest } from "@/lib/types/localization"
import { LocalizationResponse } from "@/lib/types/localizationResponse"

export default function LocalizationPage() {
  const [result, setResult] = useState<LocalizationResponse | null>(null)

  const handleSubmit = (request: LocalizationRequest, response: LocalizationResponse) => {
    setResult(response)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <LocalizationRequestForm onSubmit={handleSubmit} />
        </div>
        
        <div className="space-y-6">
          {result && <LocalizationResults results={result} />}
        </div>
      </div>
    </div>
  )
}
