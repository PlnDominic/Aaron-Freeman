"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FileCheck, Compass, Leaf, Users } from "lucide-react"

const expertise = [
  {
    icon: FileCheck,
    title: "Statutory Planning",
    description: "Development assessment, planning reports, Information Requests and planning approvals.",
  },
  {
    icon: Compass,
    title: "Development Advisory",
    description: "Planning due diligence, pre-lodgement advice and development pathways.",
  },
  {
    icon: Leaf,
    title: "Environmental Management",
    description: "Environmental compliance, sustainability and regulatory approvals.",
  },
  {
    icon: Users,
    title: "Stakeholder Engagement",
    description: "Working collaboratively with clients, consultants, councils and communities.",
  },
]

const careerHighlights = [
  { value: "2", label: "Years in Town Planning" },
  { value: "3", label: "Years in Environmental Management" },
  { value: "Queensland", label: "Development Assessment Experience" },
]

export default function AboutSection() {
  return (
    <section id="about" className="section-navy relative overflow-hidden py-24">
      <div className="section-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow">Background</span>
            <h2 className="section-title mb-5">About Me</h2>
            <div className="blueprint-rule mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
            {/* Left - Text content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* custom-card class handles theme-specific background, border, shadow */}
              <div className="custom-card p-8">
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80 mb-6">
                  I'm Aaron Freeman, a Town Planner with experience in statutory planning, development assessment and environmental management.
                </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80 mb-6">
                  I help clients, consultants and communities navigate Queensland's planning system through practical advice, planning assessments and development approvals.
                </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80 mb-6">
                  Before transitioning into planning, I worked in environmental management within the mining industry, developing expertise in environmental compliance, stakeholder engagement and sustainable development.
                </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80 mb-6">
                  Growing up in Ghana and now practising in Australia has given me a unique perspective on how thoughtful planning can shape stronger, more resilient communities.
                </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80">
                  Beyond planning, I'm passionate about writing, embracing innovation and using technology to improve planning practice while contributing to community development initiatives.
                </p>
              </div>
            </motion.div>

            {/* Right - Studio candid */}
            <motion.div
              className="flex justify-center lg:justify-end items-start"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <figure className="relative w-full max-w-md">
                <div className="absolute -left-3 -top-3 h-14 w-14 border-l border-t border-[hsl(var(--gold))]" />
                <div className="absolute -bottom-3 -right-3 h-14 w-14 border-b border-r border-[hsl(var(--gold))]" />
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-border">
                  <Image
                    src="/images/aaron-studio.jpg"
                    alt="Aaron Freeman in the studio"
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 1024px) 100vw, 28rem"
                  />
                </div>
              </figure>
            </motion.div>
          </div>

          {/* Philosophy pull-quote */}
          <motion.div
            className="mb-16 border-l-2 border-[hsl(var(--gold))] pl-6 md:pl-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="eyebrow">My philosophy</span>
            <p className="max-w-3xl text-2xl md:text-3xl font-semibold leading-snug text-foreground">
              I believe great planning balances legislation, community needs and commercial reality to create places that stand the test of time.
            </p>
          </motion.div>

          {/* Expertise */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow mb-0">Expertise</span>
              <span className="hidden h-px flex-1 bg-border sm:block" />
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {expertise.map((item) => (
                <div key={item.title} className="bg-card p-6">
                  <item.icon className="mb-4 h-5 w-5 text-[hsl(var(--gold))]" />
                  <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="eyebrow mb-0">Career Highlights</span>
              <span className="hidden h-px flex-1 bg-border sm:block" />
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-primary/25 bg-primary/20 sm:grid-cols-3">
              {careerHighlights.map((stat) => (
                <div key={stat.label} className="bg-card px-6 py-8 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
