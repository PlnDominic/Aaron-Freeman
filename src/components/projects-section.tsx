"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Building, Leaf, Zap, MapPin, TreePine, Users, FileText, Download } from "lucide-react"

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
  "Urban & Environmental Projects": <MapPin className="w-4 h-4 text-primary" />,
  "Environmental & Compliance Experience": <TreePine className="w-4 h-4 text-primary" />,
  "Community & Volunteer Leadership": <Users className="w-4 h-4 text-primary" />
}

const categories = ["All", "Urban & Environmental Projects", "Environmental & Compliance Experience", "Community & Volunteer Leadership"]

// Overlapping positions for 5 cards (desktop, right-aligned vertical cascade with spacing and horizontal offset)
const overlapStyles = [
  "z-50 right-0 top-0 w-80 h-64",
  "z-40 right-8 top-32 w-80 h-64",
  "z-30 right-16 top-64 w-80 h-64",
  "z-20 right-24 top-[18rem] w-80 h-64",
  "z-10 right-32 top-[25rem] w-80 h-64",
]

function ProjectCard({ project, style, index }: { project: Project; style: string; index: number }) {
  const handlePdfDownload = () => {
    // Use new cloud URL if available, fallback to old base64 data
    const pdfUrl = project.pdfUrl || project.pdfFile
    if (pdfUrl) {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${project.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <motion.div
      className={`absolute ${style} rounded-2xl shadow-xl bg-card border border-border overflow-hidden group transition-all duration-500 cursor-pointer`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.7, type: "spring" }}
      title={project.title}
      onClick={handlePdfDownload}
    >
      <div className="relative w-full h-full">
        {(project.pdfUrl || project.pdfFile) ? (
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <FileText className="w-20 h-20 text-white mb-4" />
            <div className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              PDF
            </div>
            <Download className="w-6 h-6 text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            {categoryIcons[project.category]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Project info */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{project.title}</h3>
          {project.location && (
            <p className="text-white/80 text-xs">{project.location}</p>
          )}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/90 dark:bg-card/60 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/30 shadow">
          {categoryIcons[project.category]}
          <span className="text-xs font-medium text-foreground/90 dark:text-foreground/80">{project.category}</span>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-medium text-primary-foreground">{project.status}</span>
        </div>
      </div>
    </motion.div>
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
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                onClick={() => setActiveFilter(category)}
                className={
                  activeFilter === category
                    ? "btn-primary"
                    : "btn-secondary"
                }
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
                    {categoryIcons[categoryName]}
                    <h3 className="text-2xl font-bold text-foreground">{categoryName}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => {
                          if (project.pdfFile) {
                            const link = document.createElement('a')
                            link.href = project.pdfFile
                            link.download = `${project.title}.pdf`
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }
                        }}
                      >
                        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <FileText className="w-16 h-16 text-white mb-3" />
                            <div className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                              PDF
                            </div>
                            <Download className="w-5 h-5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{project.location}</span>
                              <span>{project.year}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  if (project.pdfFile) {
                    const link = document.createElement('a')
                    link.href = project.pdfFile
                    link.download = `${project.title}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                }}
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <FileText className="w-16 h-16 text-white mb-3" />
                    <div className="bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      PDF
                    </div>
                    <Download className="w-5 h-5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">{project.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
