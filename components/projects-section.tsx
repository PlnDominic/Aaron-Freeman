"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Building2, Landmark, Leaf, Users, HeartHandshake, MapPin, FileText, Calendar, ArrowUpRight } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  pdfFile: string
  pdfUrl?: string // New cloud storage URL
  category: string
  location?: string
  year?: string
  status?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Residential Development": <Home className="w-5 h-5 text-white" />,
  "Mixed-Use Development": <Building2 className="w-5 h-5 text-white" />,
  "Character and Heritage": <Landmark className="w-5 h-5 text-white" />,
  "Environmental Management": <Leaf className="w-5 h-5 text-white" />,
  "Stakeholder Engagement": <Users className="w-5 h-5 text-white" />,
  "Community Leadership": <HeartHandshake className="w-5 h-5 text-white" />
}

const categoryHeadingIcons: Record<string, React.ReactNode> = {
  "Residential Development": <Home className="w-4 h-4 text-foreground" />,
  "Mixed-Use Development": <Building2 className="w-4 h-4 text-foreground" />,
  "Character and Heritage": <Landmark className="w-4 h-4 text-foreground" />,
  "Environmental Management": <Leaf className="w-4 h-4 text-foreground" />,
  "Stakeholder Engagement": <Users className="w-4 h-4 text-foreground" />,
  "Community Leadership": <HeartHandshake className="w-4 h-4 text-foreground" />
}

const categories = [
  "All",
  "Residential Development",
  "Mixed-Use Development",
  "Character and Heritage",
  "Environmental Management",
  "Stakeholder Engagement",
  "Community Leadership"
]

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
      className={`group relative flex flex-col overflow-hidden border border-border bg-card transition-colors duration-200 hover:border-foreground ${
        hasPdf ? "cursor-pointer" : ""
      }`}
    >
      {/* Flat header band */}
      <div className="relative h-40 overflow-hidden bg-neutral-950 border-b border-neutral-800">
        {/* category medallion */}
        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center border border-white/25">
          {categoryIcons[project.category]}
        </div>

        {/* status */}
        {project.status && (
          <div className="absolute right-5 top-5">
            <span className="inline-flex items-center gap-2 border border-white/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/85">
              <span className={`h-1.5 w-1.5 ${isCompleted ? "bg-[hsl(var(--gold))]" : "bg-white/50"}`} />
              {project.status}
            </span>
          </div>
        )}

        {/* PDF chip */}
        {hasPdf && (
          <div className="absolute bottom-4 left-5">
            <span className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/85">
              <FileText className="h-3.5 w-3.5" />
              PDF Report
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {project.category !== project.title && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--gold))]">
            {project.category}
          </p>
        )}
        <h4 className="mb-2 text-lg font-bold leading-snug text-foreground line-clamp-2">
          {project.title}
        </h4>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Meta row */}
        {(project.location || project.year) && (
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
            {project.location ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {project.location}
              </span>
            ) : (
              <span />
            )}
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {project.year}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        {hasPdf && (
          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground transition-all group-hover:gap-3">
            View document
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        )}
      </div>

      {/* Hover accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--gold))] transition-transform duration-300 group-hover:scale-x-100" />
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
          title: "Residential Development",
          description: "Planning assessments, development applications and planning approvals for residential projects across South East Queensland.",
          pdfFile: "",
          category: "Residential Development"
        },
        {
          id: "project-2",
          title: "Mixed-Use Development",
          description: "Planning strategy, development assessment and consultant coordination.",
          pdfFile: "",
          category: "Mixed-Use Development"
        },
        {
          id: "project-3",
          title: "Character and Heritage",
          description: "Traditional Building Character Overlay assessments, demolition applications and character design reviews.",
          pdfFile: "",
          category: "Character and Heritage"
        },
        {
          id: "project-4",
          title: "Environmental Management",
          description: "Environmental compliance, sustainability and regulatory approvals within the mining sector.",
          pdfFile: "",
          category: "Environmental Management"
        },
        {
          id: "project-5",
          title: "Stakeholder Engagement",
          description: "Working collaboratively with clients, consultants, councils and communities.",
          pdfFile: "",
          category: "Stakeholder Engagement"
        },
        {
          id: "project-6",
          title: "Community Leadership",
          description: "Leadership in the Ghanaians Queensland Community, mentoring, volunteering and multicultural engagement.",
          pdfFile: "",
          category: "Community Leadership"
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
  const projectsByCategory: Record<string, Project[]> = Object.fromEntries(
    categories.filter((c) => c !== "All").map((c) => [c, projects.filter((p) => p.category === c)])
  )

  return (
    <section className="projects-section-bg" id="projects">
      <div className="section-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Portfolio</span>
          </motion.div>
          <motion.h2
            className="section-title mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Featured Projects
          </motion.h2>
          <div className="blueprint-rule mx-auto mb-8" />
          <motion.p
            className="text-lg text-foreground/70 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A selection of statutory planning, development assessment and environmental management work delivered across Queensland.
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

        {/* Selected work: featured imagery */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="eyebrow mb-0">Selected work</span>
            <span className="hidden h-px flex-1 bg-border sm:block" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <figure className="border border-border">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/renovation-before-after.jpg"
                  alt="Character home renewal, before and after"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <figcaption className="p-4 text-sm text-muted-foreground">
                Character-home renewal, heritage frontage retained, amenity modernised. Brisbane.
              </figcaption>
            </figure>
            <figure className="border border-border">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                <Image
                  src="/images/site-plan.jpg"
                  alt="Concept masterplan sketch"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <figcaption className="p-4 text-sm text-muted-foreground">
                Concept masterplan for mixed-use residential with landscaped setbacks.
              </figcaption>
            </figure>
          </div>
        </motion.div>

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
                    <span className="flex h-9 w-9 items-center justify-center border border-border">
                      {categoryHeadingIcons[categoryName]}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">{categoryName}</h3>
                    <span className="ml-1 border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
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
