import { getSupabaseClient } from "@/lib/supabase"

export interface Comment {
  id: string
  blogPostId: string
  authorName: string
  content: string
  createdAt: string
  parentId: string | null
}

interface CommentRow {
  id: string
  blog_post_id: string
  author_name: string
  content: string
  created_at: string
  parent_id: string | null
}

function rowToComment(row: CommentRow): Comment {
  return {
    id: row.id,
    blogPostId: row.blog_post_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
    parentId: row.parent_id,
  }
}

const COMMENT_COLUMNS = "id, blog_post_id, author_name, content, created_at, parent_id"

export async function listComments(blogPostId: string): Promise<Comment[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_COLUMNS)
    .eq("blog_post_id", blogPostId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data as CommentRow[]).map(rowToComment)
}

export async function createComment(input: {
  blogPostId: string
  authorName: string
  authorEmail: string
  content: string
  parentId?: string | null
}): Promise<Comment> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("comments")
    .insert({
      blog_post_id: input.blogPostId,
      author_name: input.authorName,
      author_email: input.authorEmail,
      content: input.content,
      parent_id: input.parentId ?? null,
    })
    .select(COMMENT_COLUMNS)
    .single()

  if (error) throw error
  return rowToComment(data as CommentRow)
}
