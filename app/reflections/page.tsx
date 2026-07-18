import type { Metadata } from "next"
import { getPost } from "@/lib/posts"
import { getSiteUrl } from "@/lib/site"
import ReflectionsPageClient from "@/components/reflections-page-client"

type Props = {
  searchParams: Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams
  if (!id) return {}

  try {
    const post = await getPost(id)
    if (!post) return {}

    const url = `${getSiteUrl()}/reflections?id=${post.id}`
    const images = post.image ? [{ url: post.image }] : undefined

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

export default function ReflectionsPage() {
  return <ReflectionsPageClient />
}
