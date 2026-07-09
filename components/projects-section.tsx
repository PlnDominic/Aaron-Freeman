"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MapPin, TreePine, Users, FileText, Calendar, ArrowUpRight } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  pdfFile: string
  pdfUrl?: string // New cloud storage URL
  category: string
  location?: string
  year?: string
  status: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Urban & Environmental Projects": <MapPin className="w-5 h-5 text-primary" />,
  "Environmental & Compliance Experience": <TreePine className="w-5 h-5 text-primary" />,
  "Community & Volunteer Leadership": <Users className="w-5 h-5 text-primary" />
}

const categoryHeadingIcons: Record<string, React.ReactNode> = {
  "Urban & Environmental Projects": <MapPin className="w-4 h-4 text-primary" />,
  "Environmental & Compliance Experience": <TreePine className="w-4 h-4 text-primary" />,
  "Community & Volunteer Leadership": <Users className="w-4 h-4 text-primary" />
}

const categories = ["All", "Urban & Environmental Projects", "Environmental & Compliance Experience", "Community & Volunteer Leadership"]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const pdfUrl = project.pdfUrl || project.pdfFile
  const hasPdf = Boolean(pdfUrl)

  const handlePdfDownload = () => {
    if (!hasPdf) return
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${project.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isCompleted = project.status?.toLowerCase() === "completed"

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handlePdfDownload}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_45px_-15px_rgba(15,38,51,0.4)] ${
        hasPdf ? "cursor-pointer" : ""
      }`}
    >
      {/* Blueprint header band */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[hsl(205_52%_11%)] via-[hsl(205_50%_15%)] to-[hsl(202_42%_22%)]">
        {/* fine blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,154,92,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,154,92,0.4) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* soft gold glow */}
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />

        {/* category medallion */}
        <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 backdrop-blur-sm">
          {categoryIcons[project.category]}
        </div>

        {/* status pill */}
        <div className="absolute right-5 top-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
              isCompleted
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-amber-300/40 bg-amber-400/15 text-amber-200"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-primary" : "bg-amber-300"}`} />
            {project.status}
          </span>
        </div>

        {/* PDF chip */}
        {hasPdf && (
          <div className="absolute bottom-4 left-5">
            <span className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <FileText className="h-3.5 w-3.5" />
              PDF Report
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">
          {project.category}
        </p>
        <h4 className="mb-2 text-lg font-bold leading-snug text-foreground line-clamp-2">
          {project.title}
        </h4>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          {project.location ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              {project.location}
            </span>
          ) : (
            <span />
          )}
          {project.year && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary/70" />
              {project.year}
            </span>
          )}
        </div>

        {/* CTA */}
        {hasPdf && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-700 transition-all group-hover:gap-3 dark:text-amber-400">
            View document
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        )}
      </div>

      {/* Hover accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-amber-600 transition-transform duration-300 group-hover:scale-x-100" />
    </motion.article>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState("All")

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('featuredProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Default projects for demonstration
      const defaultProjects: Project[] = [
        {
          id: "project-1",
          title: "Green Urban Corridor Development",
          description: "Sustainable urban planning project focusing on green infrastructure and biodiversity.",
          pdfFile: "",
          category: "Urban & Environmental Projects",
          location: "Brisbane, QLD",
          year: "2023",
          status: "Completed"
        },
        {
          id: "project-2",
          title: "Environmental Impact Assessment",
          description: "Comprehensive environmental compliance and regulatory assessment for major development project.",
          pdfFile: "",
          category: "Environmental & Compliance Experience",
          location: "Gold Coast, QLD",
          year: "2024",
          status: "In Progress"
        },
        {
          id: "project-3",
          title: "Community Housing Initiative",
          description: "Volunteer leadership project coordinating affordable housing solutions for local community.",
          pdfFile: "",
          category: "Community & Volunteer Leadership",
          location: "Sunshine Coast, QLD",
          year: "2023",
          status: "Completed"
        }
      ]
      setProjects(defaultProjects)
      localStorage.setItem('featuredProjects', JSON.stringify(defaultProjects))
    }

    // Listen for project updates from admin
    const handleProjectsUpdate = () => {
      const updatedProjects = localStorage.getItem('featuredProjects')
      if (updatedProjects) {
        setProjects(JSON.parse(updatedProjects))
      }
    }

    window.addEventListener('projectsUpdated', handleProjectsUpdate)

    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate)
    }
  }, [])

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((project: Project) => project.category === activeFilter)

  // Group projects by category for better organization
  const projectsByCategory = {
    "Urban & Environmental Projects": projects.filter(p => p.category === "Urban & Environmental Projects"),
    "Environmental & Compliance Experience": projects.filter(p => p.category === "Environmental & Compliance Experience"),
    "Community & Volunteer Leadership": projects.filter(p => p.category === "Community & Volunteer Leadership")
  }

  return (
    <section className="projects-section-bg" id="projects">
      <div className="section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Portfolio
          </motion.p>
          <motion.h2
            className="section-title mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Featured Projects
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/70 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore my comprehensive portfolio of urban and environmental planning projects, organized by specialization areas. Each PDF document contains detailed project analysis, methodologies, and outcomes.
          </motion.p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                className={activeFilter === category ? "btn-primary" : "btn-secondary"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Display */}
        {activeFilter === "All" ? (
          // Show all categories organized
          <div className="space-y-16">
            {Object.entries(projectsByCategory).map(([categoryName, categoryProjects]) => (
              categoryProjects.length > 0 && (
                <motion.div
                  key={categoryName}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                      {categoryHeadingIcons[categoryName]}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">{categoryName}</h3>
                    <span className="ml-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {categoryProjects.length}
                    </span>
                    <span className="ml-2 hidden h-px flex-1 bg-border sm:block" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                  </div>
                </motion.div>
              )
            ))}
          </div>
        ) : (
          // Show filtered projects
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
