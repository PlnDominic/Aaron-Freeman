"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion"
import { ArrowDown, MapPin, Building, Leaf } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const heroRef = useRef<HTMLElement>(null)
  const controls = useAnimation()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 15)
        mouseY.set(y * 15)
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden py-8 pt-16"
    >
      <div className="section-padding z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-left"
          >
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="h-px w-8 bg-primary" />
              <span className="eyebrow mb-0">Urban &amp; Environmental Planner</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-[5rem] font-bold leading-[1.03] tracking-tight mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Aaron Freeman
            </motion.h1>

            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Building className="h-5 w-5 lucide-icon" />
              <span className="text-lg md:text-xl text-foreground/70 dark:text-foreground/70 font-medium">
                Sustainable cities, thoughtfully planned
              </span>
              <Leaf className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            </motion.div>

            <motion.p
              className="text-lg md:text-xl mb-6 text-foreground/70 dark:text-foreground/60 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Designing sustainable cities of tomorrow through innovative urban planning and environmental solutions
            </motion.p>

            <motion.div
              className="flex items-center gap-2 mb-8 text-foreground/70 dark:text-foreground/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <MapPin className="h-5 w-5 lucide-icon" />
              <span className="text-lg">Brisbane, QLD, Australia</span>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <Button
                onClick={scrollToProjects}
                size="lg"
                className="btn-primary px-8 py-3 group"
              >
                <span className="relative z-10">Explore My Work</span>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="btn-secondary px-8 py-3"
              >
                <a href="#contact">Get In Touch</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side - Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ x: springX, y: springY }}
          >
            <motion.div
              className="relative w-80 h-[26rem] md:w-96 md:h-[32rem] lg:w-[26rem] lg:h-[34rem]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              {/* thin gold corner accent */}
              <div className="absolute -left-3 -top-3 h-16 w-16 border-l border-t border-[hsl(var(--gold))]" />
              <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b border-r border-[hsl(var(--gold))]" />
              <div className="relative h-full w-full overflow-hidden border border-border bg-background">
                <Image src="/images/aaron.jpg" alt="Aaron Freeman" fill className="object-cover grayscale" priority />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="animate-bounce text-primary hover:text-primary/80 lucide-icon"
          >
            <ArrowDown />
            <span className="sr-only">Scroll down</span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
