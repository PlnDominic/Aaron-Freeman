"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { type BlogPost, listPosts } from "@/lib/posts"

export default function ReflectionsSection() {
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
    <section id="reflections" className="section-navy py-24">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Journal</span>
          <h2 className="section-title mb-5">Reflections &amp; Insights</h2>
          <div className="blueprint-rule mx-auto mb-6" />
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-3xl mx-auto">
            Reflections on planning practice, professional growth, innovation and the future of planning.
          </p>
        </motion.div>

        {posts.length === 0 && (
          <div className="mx-auto max-w-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            No reflections published yet. Check back soon.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/50 backdrop-blur-sm">
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
                  <div className="flex items-center justify-between text-sm text-foreground/60 mb-2">
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
                  
                  <Link href={`/reflections/${post.slug}`}>
                    <Button variant="ghost" className="group-hover:text-primary p-0 h-auto">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 