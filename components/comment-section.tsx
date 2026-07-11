"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, Loader2, CornerDownRight } from "lucide-react"
import { type Comment, listComments, createComment } from "@/lib/comments"

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function CommentForm({
  onSubmit,
  submitLabel = "Post Comment",
  compact = false,
}: {
  onSubmit: (values: { name: string; email: string; content: string }) => Promise<void>
  submitLabel?: string
  compact?: boolean
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError("Please enter your name.")
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (content.trim().length < 3) {
      setError("Comment is too short.")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), content: content.trim() })
      setName("")
      setEmail("")
      setContent("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className="grid gap-1.5">
          <Label htmlFor={`name-${compact ? "reply" : "root"}`}>Name</Label>
          <Input
            id={`name-${compact ? "reply" : "root"}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`email-${compact ? "reply" : "root"}`}>Email</Label>
          <Input
            id={`email-${compact ? "reply" : "root"}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <p className="text-xs text-muted-foreground">Not published.</p>
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`content-${compact ? "reply" : "root"}`}>Comment</Label>
        <Textarea
          id={`content-${compact ? "reply" : "root"}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={compact ? 3 : 4}
          placeholder="Share your thoughts..."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}

export default function CommentSection({ blogPostId }: { blogPostId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    listComments(blogPostId)
      .then(setComments)
      .catch((error) => console.error("Error loading comments:", error))
      .finally(() => setIsLoading(false))
  }, [blogPostId])

  const topLevel = comments.filter((c) => !c.parentId)
  const repliesFor = (id: string) => comments.filter((c) => c.parentId === id)

  const postComment = async (
    values: { name: string; email: string; content: string },
    parentId: string | null
  ) => {
    const newComment = await createComment({
      blogPostId,
      authorName: values.name,
      authorEmail: values.email,
      content: values.content,
      parentId,
    })
    setComments((prev) => [...prev, newComment])
    setReplyingTo(null)
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="mb-8 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[hsl(var(--gold))]" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Comments {comments.length > 0 && <span className="text-muted-foreground">({comments.length})</span>}
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : (
        <>
          {topLevel.length === 0 && (
            <p className="mb-8 text-sm text-muted-foreground">Be the first to share your thoughts.</p>
          )}

          <div className="mb-10 space-y-8">
            {topLevel.map((comment) => (
              <div key={comment.id}>
                <div className="border border-border p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-foreground">{comment.authorName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {comment.content}
                  </p>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <CornerDownRight className="h-3.5 w-3.5" />
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {repliesFor(comment.id).length > 0 && (
                  <div className="ml-6 mt-3 space-y-3 border-l border-border pl-6">
                    {repliesFor(comment.id).map((reply) => (
                      <div key={reply.id} className="border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-foreground">{reply.authorName}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === comment.id && (
                  <div className="ml-6 mt-3 border-l border-border pl-6">
                    <CommentForm
                      compact
                      submitLabel="Post Reply"
                      onSubmit={(values) => postComment(values, comment.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="border border-border p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Leave a Comment</h3>
        <CommentForm onSubmit={(values) => postComment(values, null)} />
      </div>
    </section>
  )
}
