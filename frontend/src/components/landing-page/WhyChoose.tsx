;

import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, Clock, Gift, Store, Earth } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const features = [
  {
    icon: <Store className="w-6 h-6 text-primary" />,
    title: "Designed for Small Businesses",
    description:
      "Unlike generic NFT platforms, Fundly is purpose-built for MSMEs to raise capital and manage backers.",
  },
  {
    icon: <Earth className="w-6 h-6 text-primary" />,
    title: "Real-World Utility for NFTs",
    description:
      "NFTs on Fundly represent actual revenue share, not just digital art — making them a true financial asset.",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: "Passive Income for Investors",
    description:
      "Investors earn passive income by holding NFTs that represent a share of the MSME's revenue.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Transparent & Auditable Workflows",
    description:
      "Fundly's transparent and auditable workflows ensure that all transactions are fair and transparent.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-20 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4"
            >
              <span className="text-sm text-emerald-700 tracking-wide font-medium">Impact Thinking</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-foreground">
              Why Choose Fundly?
            </h2>

            <p className="text-foreground/40 mb-8">
              We&#39;re revolutionizing the MSME financing industry by solving
              long-standing problems and creating new opportunities for MSMEs,
              investors, and lenders alike.
            </p>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className=" backdrop-blur-sm border border-primary/20 rounded-xl p-5 bg-emerald-100/10"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/40 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}