import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getPost } from "@/lib/posts"
import ReflectionsListClient from "@/components/reflections-list-client"

type Props = {
  searchParams: Promise<{ id?: string }>
}

export const metadata: Metadata = {
  title: "Reflections & Insights | Aaron Freeman",
  description:
    "Reflections on planning practice, professional growth, innovation and the future of planning.",
}

export default async function ReflectionsPage({ searchParams }: Props) {
  const { id } = await searchParams

  // Legacy links used ?id=<uuid>. Redirect them to the new slug-based URL
  // so old shared/indexed links keep working.
  if (id) {
    const post = await getPost(id).catch(() => null)
    if (post) redirect(`/reflections/${post.slug}`)
  }

  return <ReflectionsListClient />
}
