import { Suspense } from "react"
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BlogIndexClient } from "@/components/blog/blog-index-client"
import { listPosts, listTags } from "@/lib/blog/loader"

export const metadata: Metadata = {
  title: "Blog — Felipe Franca",
  description: "Tech tips and articles by Felipe Franca.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Felipe Franca",
    description: "Tech tips and articles by Felipe Franca.",
    url: "/blog",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}

export default function BlogIndexPage() {
  const posts = listPosts()
  const tags = listTags()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <Suspense fallback={null}>
          <BlogIndexClient posts={posts} tags={tags} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
