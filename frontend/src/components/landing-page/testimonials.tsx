"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import Profile from "@/assets/profile-pic.jpeg"
const testimonials = [
  {
    quote:
      "ImpactID has transformed my small restaurant business. The revenue-sharing model allowed me to expand without taking on traditional debt, and the investors have become our biggest advocates.",
    author: "Maria Sanchez",
    role: "Restaurant Owner, Mexico City",
    avatar: "/placeholder.svg?height=80&width=80",
    business: "El Sabor Local",
    type: "msme",
  },
  {
    quote:
      "As an investor, I've been able to directly support businesses in my community while earning consistent returns. The transparency of seeing monthly revenue reports gives me confidence in my investments.",
    author: "James Wilson",
    role: "Angel Investor",
    avatar: "/placeholder.svg?height=80&width=80",
    business: "15 MSMEs Funded",
    type: "investor",
  },
  {
    quote:
      "Our textile cooperative was struggling to secure traditional financing. Through ImpactID, we not only raised capital but connected with customers globally who value our sustainable practices.",
    author: "Priya Sharma",
    role: "Textile Cooperative Leader, India",
    avatar: "/placeholder.svg?height=80&width=80",
    business: "Artisan Textiles Collective",
    type: "msme",
  },
  {
    quote:
      "The platform's NFT structure makes investing in small businesses accessible and liquid. I've built a diverse portfolio of MSMEs that align with my values while generating better returns than traditional markets.",
    author: "Michael Chen",
    role: "Retail Investor",
    avatar: "/placeholder.svg?height=80&width=80",
    business: "32 MSMEs Funded",
    type: "investor",
  },
  {
    quote:
      "Our coffee farm has thrived with ImpactID funding. The monthly revenue sharing is manageable, and we've built relationships with investors who've become brand ambassadors for our products worldwide.",
    author: "Carlos Mendoza",
    role: "Coffee Producer, Colombia",
    avatar: "/placeholder.svg?height=80&width=80",
    business: "Altura Coffee Collective",
    type: "msme",
  },
];

export default function Testimonials() {
  const [filter, setFilter] = useState<"all" | "msme" | "investor">("all");

  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.type === filter);

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200/50 mb-4"
          >
            <span className="text-sm text-emerald-700 font-medium tracking-wide">
              Success Stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
          >
            Hear from Our{" "}
            Community
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-2xl mx-auto mb-8"
          >
            Real stories from MSMEs and investors who are creating impact and
            generating returns through our platform.
          </motion.p>

          <div className="flex justify-center gap-2 mb-12">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "border-emerald-200 text-slate-700"
              }
            >
              All Stories
            </Button>
            <Button
              variant={filter === "msme" ? "default" : "outline"}
              onClick={() => setFilter("msme")}
              className={
                filter === "msme"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "border-emerald-200 text-slate-700"
              }
            >
              MSMEs
            </Button>
            <Button
              variant={filter === "investor" ? "default" : "outline"}
              onClick={() => setFilter("investor")}
              className={
                filter === "investor"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "border-emerald-200 text-slate-700"
              }
            >
              Investors
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-white backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="mb-6 text-emerald-500">
                <Quote className="h-8 w-8 opacity-50" />
              </div>

              <p className="text-slate-700 italic mb-6 flex-grow">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={Profile}
                  alt={testimonial.author}
                  className="rounded-full border-2 aspect-square w-14 border-emerald-100"
                />
                <div>
                  <h4 className="text-slate-800 font-medium">
                    {testimonial.author}
                  </h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  <p className="text-emerald-600 text-xs font-medium mt-1">
                    {testimonial.business}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
