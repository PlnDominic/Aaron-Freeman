"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar, FileCheck } from "lucide-react"

interface Resume {
  fileName: string
  fileData?: string // Keep for backward compatibility
  fileUrl?: string // New cloud storage URL
  uploadDate: string
  fileSize: number
}

interface Certificate {
  id: string
  fileName: string
  fileData?: string // Keep for backward compatibility
  fileUrl?: string // New cloud storage URL
  uploadDate: string
  fileSize: number
  title: string
  issuer: string
  dateIssued: string
}

export default function ResumeSection() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    const loadData = () => {
      // Load resume
      const savedResume = localStorage.getItem('resume')
      if (savedResume) {
        try {
          setResume(JSON.parse(savedResume))
        } catch (error) {
          console.error('Error loading resume:', error)
        }
      }

      // Load certificates
      const savedCertificates = localStorage.getItem('certificates')
      if (savedCertificates) {
        try {
          setCertificates(JSON.parse(savedCertificates))
        } catch (error) {
          console.error('Error loading certificates:', error)
        }
      }
    }

    loadData()

    // Listen for updates from admin
    const handleResumeUpdate = () => loadData()
    const handleCertificatesUpdate = () => loadData()

    window.addEventListener('resumeUpdated', handleResumeUpdate)
    window.addEventListener('certificatesUpdated', handleCertificatesUpdate)
    
    return () => {
      window.removeEventListener('resumeUpdated', handleResumeUpdate)
      window.removeEventListener('certificatesUpdated', handleCertificatesUpdate)
    }
  }, [])

  const handleResumeDownload = () => {
    if (resume) {
      const link = document.createElement('a')
      // Use new cloud URL if available, fallback to old base64 data
      link.href = resume.fileUrl || resume.fileData || ''
      link.download = resume.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCertificateDownload = (certificate: Certificate) => {
    const link = document.createElement('a')
    // Use new cloud URL if available, fallback to old base64 data
    link.href = certificate.fileUrl || certificate.fileData || ''
    link.download = certificate.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Don't show section if no resume and no certificates
  if (!resume && certificates.length === 0) {
    return null
  }

  return (
    <section id="credentials" className="py-24 bg-background">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Credentials</span>
          <h2 className="section-title mb-5">Credentials &amp; Qualifications</h2>
          <div className="blueprint-rule mx-auto mb-6" />
          <p className="text-xl text-foreground/70 dark:text-foreground/60 max-w-3xl mx-auto">
            Professional resume and certified achievements showcasing expertise and qualifications in environmental planning and urban development.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resume Section */}
            {resume && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border border-border bg-card">
                  <CardHeader className="text-center pb-8">
                    <motion.div
                      className="mx-auto mb-6 relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Large PDF Icon */}
                      <div className="w-32 h-32 mx-auto bg-neutral-950 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <FileText className="w-16 h-16 text-white relative z-10" />
                      </div>
                      {/* Adobe PDF Label */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        PDF
                      </div>
                    </motion.div>
                    
                    <CardTitle className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      Professional Resume
                    </CardTitle>
                    <CardDescription className="text-lg text-foreground/70">
                      Complete professional background and qualifications
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 pt-0">
                    {/* File Details */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-primary" />
                          <span className="font-medium">{resume.fileName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatFileSize(resume.fileSize)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Last updated: {new Date(resume.uploadDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button 
                        onClick={handleResumeDownload}
                        size="lg"
                        className="w-full btn-primary py-6 text-lg"
                      >
                        <Download className="w-6 h-6 mr-3" />
                        Download Resume
                        <motion.div
                          className="ml-3"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </Button>
                    </motion.div>

                    <p className="text-center text-sm text-muted-foreground">
                      Opens in your default PDF viewer • Safe and secure download
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Certificates Section */}
            {certificates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    Professional Certificates
                  </h3>
                  <p className="text-center text-muted-foreground">
                    Industry-recognized certifications and achievements
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 border border-border bg-card">
                        <CardHeader className="text-center pb-4">
                          <motion.div
                            className="mx-auto mb-4 relative"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {/* PDF Certificate Icon */}
                            <div className="w-20 h-20 mx-auto bg-neutral-950 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <FileText className="w-10 h-10 text-white relative z-10" />
                            </div>
                            {/* PDF Label */}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                              PDF
                            </div>
                          </motion.div>
                          
                          <CardTitle className="text-sm font-bold mb-1 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                            {certificate.title}
                          </CardTitle>
                          <CardDescription className="text-xs text-muted-foreground">
                            {certificate.issuer}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 pt-0">
                          {/* Certificate Details */}
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Issued:</span>
                              <span className="font-medium">{certificate.dateIssued}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-medium">{formatFileSize(certificate.fileSize)}</span>
                            </div>
                          </div>

                          {/* Download Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                          >
                            <Button 
                              onClick={() => handleCertificateDownload(certificate)}
                              size="sm"
                              className="w-full btn-primary text-xs"
                            >
                              <Download className="w-3 h-3 mr-2" />
                              Download
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 