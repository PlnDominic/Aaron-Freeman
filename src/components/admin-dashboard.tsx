"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus, Trash2, Eye, EyeOff, Upload, Image as ImageIcon, Building, Leaf, Zap, MapPin, TreePine, Users, FileText, Download, Award, Shield, Sparkles, Cpu, Database, Globe } from "lucide-react"

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

interface Project {
  id: string
  title: string
  description: string
  pdfFile: string
  pdfUrl: string
  category: string
  location?: string
  year?: string
  status: string
}

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

const projectCategories = ["Urban & Environmental Projects", "Environmental & Compliance Experience", "Community & Volunteer Leadership"]
const projectStatuses = ["Completed", "In Progress", "Planning", "Concept"]

const categoryIcons: Record<string, React.ReactNode> = {
  "Urban & Environmental Projects": <MapPin className="w-4 h-4 text-primary" />,
  "Environmental & Compliance Experience": <TreePine className="w-4 h-4 text-primary" />,
  "Community & Volunteer Leadership": <Users className="w-4 h-4 text-primary" />
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [resume, setResume] = useState<Resume | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [activeTab, setActiveTab] = useState("blog")
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [secretKeySequence, setSecretKeySequence] = useState("")
  
  // Blog management state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    image: ""
  })
  const [selectedBlogImage, setSelectedBlogImage] = useState<File | null>(null)
  const blogImageInputRef = useRef<HTMLInputElement>(null)

  // Project management state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    year: "",
    status: "",
    pdfFile: ""
  })
  const [selectedProjectPdf, setSelectedProjectPdf] = useState<File | null>(null)
  const projectPdfInputRef = useRef<HTMLInputElement>(null)
  const resumeFileInputRef = useRef<HTMLInputElement>(null)
  
  // Certificate management state
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [certificateFormData, setCertificateFormData] = useState({
    title: "",
    issuer: "",
    dateIssued: ""
  })
  const [selectedCertificate, setSelectedCertificate] = useState<File | null>(null)
  const certificateFileInputRef = useRef<HTMLInputElement>(null)

  // Loading states for uploads
  const [isUploadingProject, setIsUploadingProject] = useState(false)
  const [isUploadingBlog, setIsUploadingBlog] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    // Load blog posts
    const savedPosts = localStorage.getItem('blogPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    // Load projects
    const savedProjects = localStorage.getItem('featuredProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }

    // Load resume
    const savedResume = localStorage.getItem('resume')
    if (savedResume) {
      setResume(JSON.parse(savedResume))
    }

    // Load certificates
    const savedCertificates = localStorage.getItem('certificates')
    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates))
    }

    // Secret key listener for admin access
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = secretKeySequence + event.key.toLowerCase()
      setSecretKeySequence(newSequence)
      
      // Check if the secret sequence matches "adminaccess"
      if (newSequence.includes("adminaccess")) {
        setIsVisible(true)
        setSecretKeySequence("") // Reset sequence
      } else if (newSequence.length > 20) {
        setSecretKeySequence("") // Reset if sequence gets too long
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [secretKeySequence])

  // Save blog posts with quota handling
  const savePosts = (newPosts: BlogPost[]) => {
    const savedData = saveToLocalStorage('blogPosts', newPosts)
    setPosts(savedData)
    window.dispatchEvent(new Event('postsUpdated'))
  }

  // Simple localStorage save function (files now stored in cloud)
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return data
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      alert('Error saving metadata. Please try again.')
      return data
    }
  }

  // Save projects with quota handling
  const saveProjects = (newProjects: Project[]) => {
    const savedData = saveToLocalStorage('featuredProjects', newProjects)
    setProjects(savedData)
    window.dispatchEvent(new Event('projectsUpdated'))
  }

  // Save certificates with quota handling
  const saveCertificates = (newCertificates: Certificate[]) => {
    const savedData = saveToLocalStorage('certificates', newCertificates)
    setCertificates(savedData)
    window.dispatchEvent(new Event('certificatesUpdated'))
  }

  // Blog management functions
  const handleBlogSubmit = async () => {
    if (!blogFormData.title || !blogFormData.excerpt || !blogFormData.content) return

    let imageUrl = editingPost?.image || ""
    
    if (selectedBlogImage) {
      try {
        const uploadResult = await uploadToVercelBlob(selectedBlogImage)
        imageUrl = uploadResult.url
      } catch (error) {
        console.error("Error uploading blog image:", error)
        alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return
      }
    }

    const newPost: BlogPost = {
      id: editingPost ? editingPost.id : Date.now().toString(),
      title: blogFormData.title,
      excerpt: blogFormData.excerpt,
      content: blogFormData.content,
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.ceil(blogFormData.content.split(' ').length / 200)} min read`,
      tags: blogFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: imageUrl
    }

    let updatedPosts
    if (editingPost) {
      updatedPosts = posts.map(post => post.id === editingPost.id ? newPost : post)
    } else {
      updatedPosts = [newPost, ...posts]
    }

    savePosts(updatedPosts)
    setBlogFormData({ title: "", excerpt: "", content: "", tags: "", image: "" })
    setSelectedBlogImage(null)
    setEditingPost(null)
    setBlogDialogOpen(false)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setBlogFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      image: post.image || ""
    })
    setSelectedBlogImage(null)
    setBlogDialogOpen(true)
  }

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId)
    savePosts(updatedPosts)
  }

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 10MB for images with cloud storage)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert(`Image size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit. Please use a smaller image file.`)
        e.target.value = '' // Clear the input
        return
      }
      setSelectedBlogImage(file)
    }
  }

  const handleProjectPdfSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (limit to 20MB for cloud storage)
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (file.size > maxSize) {
        alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 20MB limit. Please use a smaller PDF file.`)
        event.target.value = '' // Clear the input
        return
      }
      setSelectedProjectPdf(file)
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Upload file to Vercel Blob
  const uploadToVercelBlob = async (file: File): Promise<{ url: string; downloadUrl: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    return await response.json()
  }

  const handleProjectSubmit = async () => {
    if (!projectFormData.title || !projectFormData.description) return

    let pdfFileUrl = editingProject?.pdfFile || ""
    let pdfUrl = editingProject?.pdfUrl || ""
    
    if (selectedProjectPdf) {
      setIsUploadingProject(true)
      try {
        const uploadResult = await uploadToVercelBlob(selectedProjectPdf)
        pdfFileUrl = uploadResult.url // For backward compatibility
        pdfUrl = uploadResult.url // New cloud URL
      } catch (error) {
        console.error("Error uploading PDF:", error)
        alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsUploadingProject(false)
        return
      } finally {
        setIsUploadingProject(false)
      }
    }

    const newProject: Project = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title: projectFormData.title,
      description: projectFormData.description,
      pdfFile: pdfFileUrl,
      pdfUrl: pdfUrl,
      category: projectFormData.category,
      location: projectFormData.location,
      year: projectFormData.year,
      status: projectFormData.status
    }

    let updatedProjects
    if (editingProject) {
      updatedProjects = projects.map(project => project.id === editingProject.id ? newProject : project)
    } else {
      updatedProjects = [newProject, ...projects]
    }

    saveProjects(updatedProjects)
    setProjectFormData({ title: "", description: "", category: "", location: "", year: "", status: "", pdfFile: "" })
    setSelectedProjectPdf(null)
    setEditingProject(null)
    setProjectDialogOpen(false)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location || "",
      year: project.year || "",
      status: project.status,
      pdfFile: project.pdfFile
    })
    setSelectedProjectPdf(null)
    setProjectDialogOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId)
    saveProjects(updatedProjects)
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setBlogFormData({ title: "", excerpt: "", content: "", tags: "", image: "" })
    setSelectedBlogImage(null)
    setBlogDialogOpen(true)
  }

  const handleNewProject = () => {
    setEditingProject(null)
    setProjectFormData({ title: "", description: "", category: "", location: "", year: "", status: "", pdfFile: "" })
    setSelectedProjectPdf(null)
    setProjectDialogOpen(true)
  }

  const handleProjectPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 20MB for cloud storage)
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (file.size > maxSize) {
        alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 20MB limit. Please use a smaller PDF file.`)
        e.target.value = '' // Clear the input
        return
      }
      setSelectedProjectPdf(file)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 20MB for cloud storage)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 20MB limit. Please use a smaller PDF file.`)
      e.target.value = '' // Clear the input
      return
    }

    try {
      const uploadResult = await uploadToVercelBlob(file)
      const newResume: Resume = {
        fileName: file.name,
        fileUrl: uploadResult.url,
        uploadDate: new Date().toISOString(),
        fileSize: file.size
      }
      
      setResume(newResume)
      saveToLocalStorage('resume', newResume)
      
      // Dispatch custom event for resume update
      window.dispatchEvent(new Event('resumeUpdated'))
    } catch (error) {
      console.error('Error uploading resume:', error)
      alert(`Resume upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

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

  const handleResumeDelete = () => {
    setResume(null)
    localStorage.removeItem('resume')
    window.dispatchEvent(new Event('resumeUpdated'))
  }

  // Certificate management functions
  const handleCertificateSubmit = async () => {
    if (!certificateFormData.title || !certificateFormData.issuer || !selectedCertificate) return

    try {
      const uploadResult = await uploadToVercelBlob(selectedCertificate)
      const newCertificate: Certificate = {
        id: editingCertificate ? editingCertificate.id : Date.now().toString(),
        fileName: selectedCertificate.name,
        fileUrl: uploadResult.url,
        uploadDate: new Date().toISOString(),
        fileSize: selectedCertificate.size,
        title: certificateFormData.title,
        issuer: certificateFormData.issuer,
        dateIssued: certificateFormData.dateIssued
      }

      let updatedCertificates
      if (editingCertificate) {
        updatedCertificates = certificates.map(cert => cert.id === editingCertificate.id ? newCertificate : cert)
      } else {
        updatedCertificates = [newCertificate, ...certificates]
      }

      saveCertificates(updatedCertificates)
      setCertificateFormData({ title: "", issuer: "", dateIssued: "" })
      setSelectedCertificate(null)
      setEditingCertificate(null)
      setCertificateDialogOpen(false)
    } catch (error) {
      console.error('Error uploading certificate:', error)
      alert(`Certificate upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setCertificateFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      dateIssued: certificate.dateIssued
    })
    setSelectedCertificate(null)
    setCertificateDialogOpen(true)
  }

  const handleDeleteCertificate = (certificateId: string) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== certificateId)
    saveCertificates(updatedCertificates)
  }

  const handleNewCertificate = () => {
    setEditingCertificate(null)
    setCertificateFormData({ title: "", issuer: "", dateIssued: "" })
    setSelectedCertificate(null)
    setCertificateDialogOpen(true)
  }

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 20MB for cloud storage)
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (file.size > maxSize) {
        alert(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 20MB limit. Please use a smaller PDF file.`)
        e.target.value = '' // Clear the input
        return
      }
      setSelectedCertificate(file)
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

  if (!isVisible) {
    return null // No visible button - access via secret key sequence "adminaccess"
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="absolute inset-4 bg-gradient-to-br from-slate-950 via-gray-900 to-black border-2 border-cyan-400/50 rounded-2xl shadow-2xl shadow-cyan-500/30 overflow-hidden">
        {/* Matrix-style digital grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Animated circuit lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Horizontal lines */}
          <motion.div
            className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Vertical lines */}
          <motion.div
            className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleY: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Corner circuit nodes */}
          <motion.div
            className="absolute top-8 left-8 w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-8 right-8 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-4 h-4 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          
          {/* Flowing data particles */}
          <motion.div
            className="absolute top-1/2 left-0 w-2 h-2 bg-cyan-300 rounded-full shadow-sm"
            animate={{
              x: [0, window.innerWidth || 1200, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/3 left-0 w-1.5 h-1.5 bg-purple-300 rounded-full shadow-sm"
            animate={{
              x: [0, window.innerWidth || 1200, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
        </div>

        <div className="relative z-10 p-6 h-full overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Neural Command Center
                </h2>
                <p className="text-slate-400 text-sm">Advanced Portfolio Management System</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => setIsVisible(false)}
                className="gap-2 bg-slate-800/50 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 backdrop-blur-sm"
              >
                <EyeOff className="h-4 w-4" />
                Deactivate
              </Button>
            </motion.div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-cyan-500/30 rounded-xl p-1 backdrop-blur-md mb-8">
              <TabsTrigger 
                value="blog" 
                className="text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <motion.span className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <Cpu className="w-4 h-4" />
                  Neural Posts
                </motion.span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <motion.span className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <Zap className="w-4 h-4" />
                  Quantum Projects
                </motion.span>
              </TabsTrigger>
              <TabsTrigger 
                value="resume" 
                className="text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <motion.span className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <FileText className="w-4 h-4" />
                  Bio-Data Core
                </motion.span>
              </TabsTrigger>
              <TabsTrigger 
                value="credentials" 
                className="text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/25 hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <motion.span className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                  <Award className="w-4 h-4" />
                  Credentials Matrix
                </motion.span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blog" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Blog Posts</h3>
                <Button onClick={handleNewPost} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <Card key={post.id} className="h-fit">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {post.date} • {post.readTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70 mb-3 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Projects</h3>
                <Button onClick={handleNewProject} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="h-fit">
                    <CardHeader>
                      {project.pdfFile && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-white" />
                          <div className="absolute bottom-2 right-2 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
                            PDF
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        {categoryIcons[project.category]}
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.location && `${project.location} • `}
                        {project.year}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resume/CV Management</h3>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Current Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resume ? (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{resume.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Size: {formatFileSize(resume.fileSize)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleResumeDownload}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            onClick={handleResumeDelete}
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">No resume uploaded yet</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={() => resumeFileInputRef.current?.click()}
                      className="w-full flex items-center gap-2"
                      variant={resume ? "outline" : "default"}
                    >
                      <Upload className="w-4 h-4" />
                      {resume ? "Replace Resume" : "Upload Resume"}
                    </Button>
                    <input
                      type="file"
                      ref={resumeFileInputRef}
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      PDF files only. Max file size: 10MB
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Public Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    When a resume is uploaded, visitors will see a download link in the contact section.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">Current Status:</p>
                    <Badge variant={resume ? "default" : "secondary"}>
                      {resume ? "Resume Available" : "No Resume Uploaded"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Manage Certificates</h3>
                <Button onClick={handleNewCertificate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Certificate
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="h-fit">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{certificate.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Issued by: {certificate.issuer}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70 mb-3 line-clamp-3">
                        {certificate.dateIssued}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCertificate(certificate)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCertificate(certificate.id)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Blog Post Dialog */}
          <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                <DialogDescription>
                  {editingPost ? 'Edit your reflection post' : 'Share your thoughts and insights'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    value={blogFormData.title}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blog-excerpt">Excerpt</Label>
                  <Textarea
                    id="blog-excerpt"
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    placeholder="Brief description of your post"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blog-content">Content</Label>
                  <Textarea
                    id="blog-content"
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    placeholder="Write your full post content here"
                    rows={8}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                  <Input
                    id="blog-tags"
                    value={blogFormData.tags}
                    onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                    placeholder="Urban Planning, Sustainability, etc."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="blog-image">Post Image (Optional)</Label>
                  <div className="flex gap-2">
                    <input
                      ref={blogImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBlogImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => blogImageInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {selectedBlogImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {(selectedBlogImage || editingPost?.image) && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <ImageIcon className="h-4 w-4" />
                        {selectedBlogImage ? selectedBlogImage.name : 'Current image'}
                      </div>
                    )}
                  </div>
                  {selectedBlogImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedBlogImage)}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  {!selectedBlogImage && editingPost?.image && (
                    <div className="mt-2">
                      <img
                        src={editingPost.image}
                        alt="Current"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBlogSubmit}>
                  {editingPost ? 'Update' : 'Create'} Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Project Dialog */}
          <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Edit your project details' : 'Add a new project to your portfolio'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    placeholder="Describe your project"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-category">Category</Label>
                    <Select
                      value={projectFormData.category}
                      onValueChange={(value) => setProjectFormData({ ...projectFormData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="project-status">Status</Label>
                    <Select
                      value={projectFormData.status}
                      onValueChange={(value) => setProjectFormData({ ...projectFormData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-location">Location (Optional)</Label>
                    <Input
                      id="project-location"
                      value={projectFormData.location}
                      onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                      placeholder="Project location"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="project-year">Year (Optional)</Label>
                    <Input
                      id="project-year"
                      value={projectFormData.year}
                      onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project-pdf">Project PDF Document</Label>
                  <div className="flex gap-2">
                    <Input
                      ref={projectPdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleProjectPdfUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => projectPdfInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {selectedProjectPdf ? 'Change PDF' : 'Upload PDF'}
                    </Button>
                    {(selectedProjectPdf || editingProject?.pdfFile) && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <FileText className="h-4 w-4" />
                        {selectedProjectPdf ? selectedProjectPdf.name : 'Current PDF'}
                      </div>
                    )}
                  </div>
                  {selectedProjectPdf && (
                    <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded border">
                      <FileText className="w-8 h-8 text-red-600" />
                      <span className="text-sm font-medium">{selectedProjectPdf.name}</span>
                    </div>
                  )}
                  {!selectedProjectPdf && editingProject?.pdfFile && (
                    <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded border">
                      <FileText className="w-8 h-8 text-red-600" />
                      <span className="text-sm font-medium">Current Project PDF</span>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProjectSubmit}>
                  {editingProject ? 'Update' : 'Create'} Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Certificate Dialog */}
          <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCertificate ? 'Edit Certificate' : 'Create New Certificate'}</DialogTitle>
                <DialogDescription>
                  {editingCertificate ? 'Edit your certificate details' : 'Add a new certificate to your portfolio'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="certificate-title">Certificate Title</Label>
                  <Input
                    id="certificate-title"
                    value={certificateFormData.title}
                    onChange={(e) => setCertificateFormData({ ...certificateFormData, title: e.target.value })}
                    placeholder="Enter certificate title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="certificate-issuer">Issuer</Label>
                  <Input
                    id="certificate-issuer"
                    value={certificateFormData.issuer}
                    onChange={(e) => setCertificateFormData({ ...certificateFormData, issuer: e.target.value })}
                    placeholder="Enter certificate issuer"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="certificate-dateIssued">Date Issued</Label>
                  <Input
                    id="certificate-dateIssued"
                    value={certificateFormData.dateIssued}
                    onChange={(e) => setCertificateFormData({ ...certificateFormData, dateIssued: e.target.value })}
                    placeholder="Enter date issued"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="certificate-image">Certificate Image</Label>
                  <div className="flex gap-2">
                    <Input
                      ref={certificateFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCertificateUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => certificateFileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {selectedCertificate ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {(selectedCertificate || editingCertificate?.fileData) && (
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <ImageIcon className="h-4 w-4" />
                        {selectedCertificate ? selectedCertificate.name : 'Current image'}
                      </div>
                    )}
                  </div>
                  {selectedCertificate && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedCertificate)}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  {!selectedCertificate && editingCertificate?.fileData && (
                    <div className="mt-2">
                      <img
                        src={editingCertificate.fileData}
                        alt="Current"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCertificateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCertificateSubmit}>
                  {editingCertificate ? 'Update' : 'Create'} Certificate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
} 