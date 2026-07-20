import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import { getSiteUrl } from "@/lib/site"
import ReflectionArticle from "@/components/reflection-article"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = await getPostBySlug(slug)
    if (!post) return {}

    const url = `${getSiteUrl()}/reflections/${post.slug}`
    const images = [{ url: post.image || "/images/aaron.jpg" }]

    return {
      title: `${post.title} | Aaron Freeman`,
      description: post.excerpt,
      alternates: { canonical: url },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url,
        type: "article",
        publishedTime: post.date,
        authors: ["Aaron Freeman"],
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images,
      },
    }
  } catch (error) {
    console.error("Error generating reflection metadata:", error)
    return {}
  }
}

export default async function ReflectionPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)

  if (!post) notFound()

  return <ReflectionArticle post={post} />
}
