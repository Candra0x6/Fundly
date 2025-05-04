

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/utility/converts/formatDate"
import { MSME } from "@declarations/msme_registration/msme_registration.did"

// Mock MSME data


export function MSMEDetailReview({ msme }: { msme: MSME }) {
  console.log(msme)
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
                  <p className="text-gray-900 dark:text-white">{msme.details.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</h4>
                  <p className="text-gray-900 dark:text-white">{msme.details.focusArea}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</h4>
                  <p className="text-gray-900 dark:text-white">{msme.details.industry.slice(0, 3).map((industry) => industry).join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Founding Date</h4>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(msme.registrationDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Count</h4>
                  <p className="text-gray-900 dark:text-white">{Number(msme.financialInfo.employeeCount) / 1000}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Description</h4>
                  <p className="text-gray-900 dark:text-white mt-1">{msme.details.description}</p>
                </div>

              </div>

            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
                <p className="text-gray-900 dark:text-white">{msme.contactInfo.country}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                <p className="text-gray-900 dark:text-white">{msme.contactInfo.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                <p className="text-gray-900 dark:text-white">{msme.contactInfo.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h4>
                <p className="text-gray-900 dark:text-white">{msme.contactInfo.website}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Revenue</h4>
                <p className="text-gray-900 dark:text-white">{Number(msme.financialInfo.annualRevenue) / 1000}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Funding Goal</h4>
                <p className="text-gray-900 dark:text-white">{Number(msme.financialInfo.fundingGoal) / 1000}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Funding Purpose</h4>
                <p className="text-gray-900 dark:text-white">{msme.financialInfo.fundingPurpose || "N/A"}</p>
              </div>

            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              {msme.teamMembers.map((member, index) => (
                <div key={index} className="border-b pb-4 last:border-0 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{member.position}</p>
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
