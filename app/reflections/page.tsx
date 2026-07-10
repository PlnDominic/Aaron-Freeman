"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"

type ContentBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; caption: string }

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  blocks?: ContentBlock[]
  date: string
  readTime: string
  tags: string[]
  image?: string
}

export default function ReflectionsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    // Check if there's a specific post ID in the URL
    const urlParams = new URLSearchParams(window.location.search)
    const postId = urlParams.get('id')
    
    if (postId && savedPosts) {
      const allPosts = JSON.parse(savedPosts)
      const post = allPosts.find((p: BlogPost) => p.id === postId)
      if (post) {
        setSelectedPost(post)
      }
    }

    // Listen for updates
    const handlePostsUpdate = () => {
      const updatedPosts = localStorage.getItem('blogPosts')
      if (updatedPosts) {
        setPosts(JSON.parse(updatedPosts))
      }
    }

    window.addEventListener('postsUpdated', handlePostsUpdate)
    return () => window.removeEventListener('postsUpdated', handlePostsUpdate)
  }, [])

  if (selectedPost) {
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
                  {selectedPost.title}
                </h1>

                <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
                  {selectedPost.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Aaron Freeman</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </header>

              {selectedPost.image && (
                <figure className="mb-12">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full border border-border"
                  />
                </figure>
              )}

              {/* Body — constrained measure for readability (~65ch) */}
              <div className="mx-auto max-w-[65ch]">
                {selectedPost.blocks && selectedPost.blocks.length > 0 ? (
                  selectedPost.blocks.map((block) => {
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
                    {selectedPost.content}
                  </div>
                )}

                <div className="mt-10 flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, index) => (
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
            </article>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="section-padding py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <Link href="/#reflections">
              <Button variant="ghost" className="mb-8 gap-2 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </Button>
            </Link>

            <h1 className="section-title text-left md:text-left">
              Reflections & Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reflections on planning practice, professional growth, innovation and the future of planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="group h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/50 backdrop-blur-sm cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors duration-200">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-foreground/70">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button variant="ghost" className="group-hover:text-primary p-0 h-auto">
                      Read Full Article →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No reflections available yet.</p>
              <Link href="/#reflections">
                <Button className="mt-4">Go to Homepage</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 