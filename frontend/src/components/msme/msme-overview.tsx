"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, Users, Target, Lightbulb, Leaf } from "lucide-react"

interface MSMEOverviewProps {
  msmeId: string
}

export default function MSMEOverview({ msmeId }: MSMEOverviewProps) {
  // This would normally be fetched from an API based on the ID
  const overview = {
    mission:
      "To accelerate the transition to sustainable energy through innovative, affordable solar solutions for residential buildings in Southeast Asia.",
    vision:
      "A future where clean, renewable energy is accessible to all, reducing carbon emissions and creating a more sustainable world for generations to come.",
    impact:
      "GreenTech Solutions has installed over 5,000 solar panel systems across Southeast Asia, reducing carbon emissions by an estimated 15,000 tons annually. Our solutions have helped homeowners save an average of 30% on their electricity bills.",
    uniqueValue:
      "Our proprietary solar panel design is 20% more efficient than standard panels and costs 15% less to manufacture. We also offer flexible financing options and a user-friendly mobile app for monitoring energy production and consumption.",
    marketOpportunity:
      "The Southeast Asian solar energy market is projected to grow at a CAGR of 12% over the next five years, reaching a value of $15 billion by 2028. Residential solar installations are expected to account for 40% of this market.",
    achievements: [
      "Winner of the 2022 ASEAN Sustainability Award",
      "Featured in Forbes Asia's 30 Under 30 in Energy",
      "Secured $1.2M in seed funding from leading impact investors",
      "Granted two patents for innovative solar panel design",
      "Established partnerships with three major property developers in Singapore and Malaysia",
    ],
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">{overview.mission}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-emerald-500" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">{overview.vision}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">{overview.impact}</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Unique Value Proposition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">{overview.uniqueValue}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-emerald-500" />
                Market Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600">{overview.marketOpportunity}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-emerald-500" />
              Key Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {overview.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <span className="text-zinc-600">{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
