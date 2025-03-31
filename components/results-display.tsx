"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Download, Info } from "lucide-react"
import ImagePreview from "./image-preview"

interface ResultsDisplayProps {
    results: number[]
    imageSrc: string
}

export default function ResultsDisplay({ results, imageSrc }: ResultsDisplayProps) {
    // Assuming the model returns probabilities for [COVID, Normal, Viral Pneumonia]
    const categories = ["COVID-19", "Normal", "Viral Pneumonia"]

    // Find the highest probability and its index
    const maxIndex = results.indexOf(Math.max(...results))
    const prediction = categories[maxIndex]

    // Format probabilities as percentages
    const percentages = results.map((val) => (val * 100).toFixed(2))

    // Determine alert variant based on prediction
    const alertVariant = maxIndex === 0 ? "destructive" : maxIndex === 1 ? "default" : "warning"

    // Determine text color for each category
    const getTextColor = (index: number) => {
        if (index === maxIndex) return "font-bold"
        return "text-gray-600"
    }

    // Handle image download
    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = imageSrc
        link.download = `xray-analysis-${new Date().toISOString().split("T")[0]}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>AI-based analysis of your chest X-ray image</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ImagePreview src={imageSrc || "/placeholder.svg"} alt="X-ray" />
                        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <Alert variant={alertVariant as any}>
                            <AlertDescription className="text-lg font-semibold">Predicted: {prediction}</AlertDescription>
                        </Alert>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium">Probability Distribution</h3>

                            {categories.map((category, index) => (
                                <div key={category} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className={`text-sm ${getTextColor(index)}`}>{category}</span>
                                            {index === 0 && (
                                                <div className="relative group">
                                                    <Info className="h-3 w-3 ml-1 text-gray-400 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        COVID-19 indicators in chest X-rays include ground-glass opacities, consolidation, and
                                                        bilateral peripheral distribution.
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-sm ${getTextColor(index)}`}>{percentages[index]}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${index === 0 ? "bg-red-500" : index === 1 ? "bg-green-500" : "bg-yellow-500"
                                                }`}
                                            style={{ width: `${percentages[index]}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium mb-1">Important Note:</p>
                            <p>
                                This analysis is provided for informational purposes only and should not be considered a medical
                                diagnosis. Please consult with a healthcare professional for proper medical advice.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

