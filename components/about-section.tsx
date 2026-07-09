"use client"

import { motion } from "framer-motion"
import Globe3D from "@/components/globe-3d"

export default function AboutSection() {
  return (
    <section id="about" className="section-navy relative overflow-hidden py-20">
      {/* Subtle grid for background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 cyber-grid"></div>
      </div>

      <div className="section-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            // section-title class will handle theme-specific text color and shadow
            className="section-title mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h2>

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
                    I'm a passionate Urban and Environmental Planner with over 3 years of experience creating
                    sustainable, livable communities that balance human needs with environmental stewardship.
                  </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80 mb-6">
                    Specializing in climate-adaptive planning and smart city technologies, I believe in harnessing
                    innovation to solve complex urban challenges. From transit-oriented developments to green
                    infrastructure networks, I create comprehensive solutions that enhance quality of life.
                  </p>
                <p className="text-lg leading-relaxed text-foreground/90 dark:text-foreground/80">
                    Based in Brisbane, I work with communities, governments, and organizations across Australia to
                    transform urban landscapes into thriving, sustainable ecosystems for future generations.
                  </p>
              </div>
            </motion.div>

            {/* Right - 3D Globe */}
            <motion.div
              className="flex justify-center lg:justify-end items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-full max-w-lg"> {/* max-w-lg to match Globe3D component */}
              <Globe3D />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
