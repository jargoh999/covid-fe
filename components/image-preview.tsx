"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
    src: string
    alt: string
    className?: string
}

export default function ImagePreview({ src, alt, className }: ImagePreviewProps) {
    const [loading, setLoading] = useState(true)

    return (
        <div className={cn("relative rounded-md overflow-hidden bg-gray-100", className)}>
            {loading && <div className="w-full aspect-square md:aspect-video bg-gray-200 animate-pulse" />}
            <img
                src={src || "/placeholder.svg"}
                alt={alt}
                className={cn(
                    "w-full h-auto object-contain transition-opacity duration-300",
                    loading ? "opacity-0" : "opacity-100",
                )}
                onLoad={() => setLoading(false)}
            />
        </div>
    )
}

