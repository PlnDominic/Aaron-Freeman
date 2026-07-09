"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="section-navy relative py-8 overflow-hidden">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-md"></div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(212, 154, 92, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 154, 92, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p>© 2025 Aaron Freeman. All rights reserved.</p>
          <div className="flex items-center gap-2">
           <span>Developed by</span>
            <Link
              href="https://www.ecstasytechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 group"
            >
              Ecstasy Technologies
              <ExternalLink className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
