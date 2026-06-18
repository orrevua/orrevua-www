"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function PreviewCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  if (images.length === 1) {
    return (
      <div className="mb-4 overflow-hidden rounded-lg border border-border">
        <Image
          src={images[0]}
          alt={alt}
          width={1200}
          height={630}
          className="h-auto w-full object-cover"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className="group relative mb-4 overflow-hidden rounded-lg border border-border">
      <Image
        src={images[index]}
        alt={`${alt} (${index + 1}/${images.length})`}
        width={1200}
        height={630}
        className="h-auto w-full object-cover"
        unoptimized
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg-primary/80 p-1.5 text-text-primary opacity-0 backdrop-blur-sm transition hover:bg-bg-primary group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg-primary/80 p-1.5 text-text-primary opacity-0 backdrop-blur-sm transition hover:bg-bg-primary group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-accent" : "w-1.5 bg-text-primary/30"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
