import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  title: "Felipe Franca — Software Engineer",
  description:
    "Backend-focused fullstack engineer. 6+ years building scalable systems with Python, TypeScript, and AWS.",
  metadataBase: new URL("https://orrevua.dev"),
  openGraph: {
    title: "Felipe Franca — Software Engineer",
    description:
      "Backend-focused fullstack engineer. 6+ years building scalable systems with Python, TypeScript, and AWS.",
    url: "https://orrevua.dev",
    siteName: "Felipe Franca",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Felipe Franca — Software Engineer",
    description:
      "Backend-focused fullstack engineer. 6+ years building scalable systems with Python, TypeScript, and AWS.",
  },
  robots: {
    index: true,
    follow: true,
  },
}
