import { getSupabaseClient } from "@/lib/supabase"

export type ContentBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption: string }

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  blocks: ContentBlock[]
  date: string
  readTime: string
  tags: string[]
  image?: string
}

interface BlogPostRow {
  id: string
  title: string
  excerpt: string
  content: string
  blocks: ContentBlock[] | null
  date: string
  read_time: string
  tags: string[] | null
  image_url: string | null
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    blocks: row.blocks ?? [],
    date: row.date,
    readTime: row.read_time,
    tags: row.tags ?? [],
    image: row.image_url ?? undefined,
  }
}

export async function listPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false })

  if (error) throw error
  return (data as BlogPostRow[]).map(rowToPost)
}

export async function getPost(id: string): Promise<BlogPost | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle()

  if (error) throw error
  return data ? rowToPost(data as BlogPostRow) : null
}

export async function createPost(
  post: Omit<BlogPost, "id">
): Promise<BlogPost> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      blocks: post.blocks,
      date: post.date,
      read_time: post.readTime,
      tags: post.tags,
      image_url: post.image ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return rowToPost(data as BlogPostRow)
}

export async function updatePost(
  id: string,
  post: Omit<BlogPost, "id">
): Promise<BlogPost> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      blocks: post.blocks,
      date: post.date,
      read_time: post.readTime,
      tags: post.tags,
      image_url: post.image ?? null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return rowToPost(data as BlogPostRow)
}

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) throw error
}
