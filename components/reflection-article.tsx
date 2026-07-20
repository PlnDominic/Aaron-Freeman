"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import { type BlogPost } from "@/lib/posts"
import CommentSection from "@/components/comment-section"

export default function ReflectionArticle({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back button */}
          <Link href="/#reflections">
            <Button variant="ghost" className="mb-8 gap-2 hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Reflections
            </Button>
          </Link>

          {/* Article */}
          <article className="max-w-3xl mx-auto">
            <header className="mb-10">
              <span className="eyebrow">Reflections</span>
              <h1 className="mb-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-foreground">
                {post.title}
              </h1>

              <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Aaron Freeman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>

            {post.image && (
              <figure className="mb-12">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full border border-border"
                />
              </figure>
            )}

            {/* Body — constrained measure for readability (~65ch) */}
            <div className="mx-auto max-w-[65ch]">
              {post.blocks && post.blocks.length > 0 ? (
                post.blocks.map((block) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={block.id} className="mb-3 mt-12 text-2xl md:text-3xl font-bold tracking-tight text-foreground first:mt-0">
                        {block.text}
                      </h2>
                    )
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={block.id} className="my-10">
                        {block.url && (
                          <img src={block.url} alt={block.caption || ""} className="w-full border border-border" />
                        )}
                        {block.caption && (
                          <figcaption className="mt-3 text-center text-sm italic text-muted-foreground">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }
                  return (
                    <p key={block.id} className="mb-6 text-lg leading-relaxed text-foreground/90">
                      {block.text}
                    </p>
                  )
                })
              ) : (
                <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
                  {post.content}
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground flex items-center justify-center text-background font-bold">
                    AF
                  </div>
                  <div>
                    <p className="font-semibold">Aaron Freeman</p>
                    <p className="text-sm text-muted-foreground">Town Planner</p>
                  </div>
                </div>

                <Link href="/#reflections">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    More Posts
                  </Button>
                </Link>
              </div>
            </footer>

            <CommentSection blogPostId={post.id} />
          </article>
        </motion.div>
      </div>
    </div>
  )
}
