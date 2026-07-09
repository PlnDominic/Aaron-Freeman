"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  tags: string[]
  image?: string
}

export default function ReflectionsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Load posts from localStorage or use default posts
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Default posts for demonstration
      const defaultPosts: BlogPost[] = [
        {
          id: "1",
          title: "The Future of Sustainable Urban Development",
          excerpt: "Exploring innovative approaches to create cities that balance economic growth with environmental stewardship.",
          content: "Urban development in the 21st century requires a fundamental shift in how we approach city planning.",
          date: "2024-01-15",
          readTime: "5 min read",
          tags: ["Urban Planning", "Sustainability", "Environment"]
        },
        {
          id: "2",
          title: "Green Infrastructure: Nature's Solution to Urban Challenges",
          excerpt: "How incorporating natural systems into city design can address multiple urban challenges simultaneously.",
          content: "Green infrastructure represents a paradigm shift in urban planning, where nature-based solutions are integrated.",
          date: "2024-01-08",
          readTime: "4 min read",
          tags: ["Green Infrastructure", "Climate Resilience", "Urban Design"]
        },
        {
          id: "3",
          title: "Community-Centered Planning: Building Cities for People",
          excerpt: "The importance of involving local communities in the urban planning process to create truly livable spaces.",
          content: "Successful urban planning must put people at the center of every decision, ensuring that development serves the community.",
          date: "2024-01-01",
          readTime: "3 min read",
          tags: ["Community Planning", "Social Equity", "Public Participation"]
        }
      ]
      setPosts(defaultPosts)
      localStorage.setItem('blogPosts', JSON.stringify(defaultPosts))
    }

    // Listen for storage changes to update posts when admin makes changes
    const handleStorageChange = () => {
      const updatedPosts = localStorage.getItem('blogPosts')
      if (updatedPosts) {
        setPosts(JSON.parse(updatedPosts))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-page updates
    const handlePostsUpdate = () => {
      const updatedPosts = localStorage.getItem('blogPosts')
      if (updatedPosts) {
        setPosts(JSON.parse(updatedPosts))
      }
    }

    window.addEventListener('postsUpdated', handlePostsUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('postsUpdated', handlePostsUpdate)
    }
  }, [])

  return (
    <section id="reflections" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-600 to-amber-800 dark:from-amber-400 dark:via-amber-500 dark:to-amber-600">
            Reflections & Insights
          </h2>
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-3xl mx-auto">
            Thoughts and perspectives on urban planning, sustainability, and creating better cities for tomorrow
          </p>
        </motion.div>

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
                  
                  <Link href={`/reflections?id=${post.id}`}>
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