"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImagePreview from "@/components/image-preview"
import ResultsDisplay from "@/components/results-display"
import { Toaster } from "@/components/toast/toaster"
import { useToast } from "@/components/toast/use-toast"


// API endpoint for predictions
const API_URL = "http://51.20.84.12:8000/predict"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<number[] | null>(null)
  const { toast } = useToast()

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    handleSelectedFile(selectedFile)
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const selectedFile = e.dataTransfer.files?.[0]
    handleSelectedFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  // Process the selected file
  const handleSelectedFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return

    // Check if file is an image
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)

    setFile(selectedFile)
    setResults(null)
    setError(null)
  }

  // Clear the selected file
  const handleClearFile = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setError(null)
  }

  // Submit the image for prediction
  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.prediction[0])

      toast({
        title: "Analysis complete",
        description: "Your X-ray has been successfully analyzed.",
      })
    } catch (err) {
      console.error("Error submitting image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")

      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">COVID-19 X-Ray Analysis</h1>
          <p className="mt-2 text-lg text-gray-600">Upload a chest X-ray image to check for COVID-19 indicators</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload X-Ray</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload X-Ray Image</CardTitle>
                <CardDescription>Drag and drop your chest X-ray image or click to browse</CardDescription>
              </CardHeader>
              <CardContent>
                {!file ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and drop your X-ray image here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">Supports: JPEG, PNG, WEBP</p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white rounded-full"
                        onClick={handleClearFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <ImagePreview src={preview! || "/placeholder.svg"} alt="X-ray preview" />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>File: {file.name}</p>
                      <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleClearFile} disabled={!file || loading}>
                  Clear
                </Button>
                <Button onClick={handleSubmit} disabled={!file || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze X-Ray"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {results && <ResultsDisplay results={results} imageSrc={preview!} />}
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Analyzing your X-ray...</p>
            <Progress value={100} className="animate-pulse" />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
