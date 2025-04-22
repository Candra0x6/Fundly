import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-600 text-sm">{description}</p>
    </div>
  )
}
