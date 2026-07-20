"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { type BlogPost, listPosts } from "@/lib/posts"

export default function ReflectionsListClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const loadPosts = () => {
      listPosts()
        .then(setPosts)
        .catch((error) => console.error('Error loading posts:', error))
    }

    loadPosts()

    // Refetch when the admin panel creates/edits/deletes a post in the same tab
    window.addEventListener('postsUpdated', loadPosts)
    return () => window.removeEventListener('postsUpdated', loadPosts)
  }, [])

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
                <Link href={`/reflections/${post.slug}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/50 backdrop-blur-sm cursor-pointer">
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
                </Link>
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
