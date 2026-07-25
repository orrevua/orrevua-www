import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BlogArticleClient } from "@/components/blog/blog-article-client"
import { BlogBackLink } from "@/components/blog/blog-back-link"
import { BlogPostHeader } from "@/components/blog/blog-post-header"
import { getPostBySlug, listPosts } from "@/lib/blog/loader"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return listPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const { title, description } = post.translations.en
  const canonical = `/blog/${slug}`

  return {
    title: `${title} — Felipe Franca`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [post.cover] : [],
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { title, description } = post.translations.en
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: post.date,
    author: { "@type": "Person", name: "Felipe Franca" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://orrevua.dev/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
    ...(post.cover ? { image: [`https://orrevua.dev${post.cover}`] } : {}),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <BlogBackLink />
          <div className="mt-8">
            <BlogPostHeader post={post} />
            <BlogArticleClient
              en={<MDXRemote source={post.content.en} components={{}} />}
              pt={<MDXRemote source={post.content.pt} components={{}} />}
            />
          </div>
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
