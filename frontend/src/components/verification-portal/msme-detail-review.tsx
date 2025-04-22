"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MSMEDetailReviewProps {
  msmeId: string
}

// Mock MSME data
const msmeDetails = {
  business: {
    name: "Green Harvest Farms",
    type: "Sole Proprietorship",
    industry: "Agriculture",
    description:
      "Green Harvest Farms is a sustainable farming operation specializing in organic vegetables and fruits. We use eco-friendly farming practices to produce high-quality, nutritious food while preserving the environment.",
    foundingDate: "2018-05-12",
    employeeCount: 8,
    registrationNumber: "BRN-12345-GH",
  },
  contact: {
    address: "123 Rural Road, Farmville, AG 54321",
    phone: "+254 712 345 678",
    email: "info@greenharvestfarms.com",
    website: "www.greenharvestfarms.com",
  },
  financial: {
    annualRevenue: "$120,000",
    fundingStage: "Growth",
    investmentNeeded: "$50,000",
    currentInvestors: 0,
    profitLastYear: "$35,000",
  },
  team: [
    {
      name: "John Mwangi",
      role: "Founder & CEO",
      bio: "Agricultural expert with 15 years of experience in sustainable farming",
    },
    {
      name: "Sarah Ochieng",
      role: "Operations Manager",
      bio: "Former agricultural extension officer with expertise in farm management",
    },
    {
      name: "David Kamau",
      role: "Finance Manager",
      bio: "Accounting professional with experience in agricultural businesses",
    },
  ],
}

export function MSMEDetailReview({ msmeId }: MSMEDetailReviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">MSME Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</h4>
                  <p className="text-gray-900 dark:text-white">{msmeDetails.business.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</h4>
                  <p className="text-gray-900 dark:text-white">{msmeDetails.business.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</h4>
                  <p className="text-gray-900 dark:text-white">{msmeDetails.business.industry}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Founding Date</h4>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(msmeDetails.business.foundingDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Count</h4>
                  <p className="text-gray-900 dark:text-white">{msmeDetails.business.employeeCount}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Number</h4>
                  <p className="text-gray-900 dark:text-white">{msmeDetails.business.registrationNumber}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Description</h4>
                <p className="text-gray-900 dark:text-white mt-1">{msmeDetails.business.description}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.contact.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.contact.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.contact.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.contact.website}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Revenue</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.financial.annualRevenue}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Funding Stage</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.financial.fundingStage}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Investment Needed</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.financial.investmentNeeded}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Investors</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.financial.currentInvestors}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Last Year</h4>
                <p className="text-gray-900 dark:text-white">{msmeDetails.financial.profitLastYear}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              {msmeDetails.team.map((member, index) => (
                <div key={index} className="border-b pb-4 last:border-0 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{member.bio}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
