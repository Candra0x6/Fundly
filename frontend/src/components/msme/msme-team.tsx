"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter, Mail } from "lucide-react"

interface MSMETeamProps {
  msmeId: string
}

export default function MSMETeam({ msmeId }: MSMETeamProps) {
  // This would normally be fetched from an API based on the ID
  const team = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Sarah has over 15 years of experience in renewable energy and previously led sustainability initiatives at a major energy corporation. She holds an MBA from INSEAD and a BS in Electrical Engineering from NUS.",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
      email: "sarah@greentechsolutions.example",
    },
    {
      id: "2",
      name: "David Lim",
      role: "CTO & Co-Founder",
      image: "/placeholder.svg?height=200&width=200",
      bio: "David is a solar technology expert with multiple patents in photovoltaic cell design. He previously worked at Tesla's energy division and holds a PhD in Materials Science from MIT.",
      linkedin: "https://linkedin.com/in/davidlim",
      twitter: "https://twitter.com/davidlim",
      email: "david@greentechsolutions.example",
    },
    {
      id: "3",
      name: "Mei Lin",
      role: "CFO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Mei brings 12 years of financial experience from her time at DBS Bank and as CFO of a renewable energy startup. She holds a CFA and an MBA from London Business School.",
      linkedin: "https://linkedin.com/in/meilin",
      twitter: "https://twitter.com/meilin",
      email: "mei@greentechsolutions.example",
    },
    {
      id: "4",
      name: "Raj Patel",
      role: "COO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Raj has extensive operations experience across Southeast Asia, having scaled multiple hardware startups in the region. He holds an MBA from INSEAD and a BS in Industrial Engineering from IIT.",
      linkedin: "https://linkedin.com/in/rajpatel",
      twitter: "https://twitter.com/rajpatel",
      email: "raj@greentechsolutions.example",
    },
    {
      id: "5",
      name: "Nguyen Thi Minh",
      role: "Head of Business Development",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Minh leads our expansion efforts across Southeast Asia. She previously worked at Grab and has extensive experience in market entry strategies. She holds an MBA from NUS.",
      linkedin: "https://linkedin.com/in/nguyenthiminh",
      twitter: "https://twitter.com/nguyenthiminh",
      email: "minh@greentechsolutions.example",
    },
    {
      id: "6",
      name: "Tom Jackson",
      role: "Lead Engineer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Tom oversees our engineering team and product development. He has 10 years of experience in solar technology and previously worked at Sunrun. He holds a MS in Mechanical Engineering from Stanford.",
      linkedin: "https://linkedin.com/in/tomjackson",
      twitter: "https://twitter.com/tomjackson",
      email: "tom@greentechsolutions.example",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {team.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden h-full">
            <div className="aspect-square bg-zinc-100 relative">
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-emerald-600 text-sm mb-3">{member.role}</p>
              <p className="text-zinc-600 text-sm mb-4">{member.bio}</p>
              <div className="flex items-center gap-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a href={`mailto:${member.email}`} className="text-zinc-500 hover:text-zinc-800 transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
