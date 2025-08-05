"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { creditBenefits, features, testimonials } from "@/lib/data";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pricing from "@/components/pricing";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8 max-w-xl"
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="bg-sky-900/30 border-sky-700/30 px-4 py-2 text-sky-200 text-sm font-medium"
              >
                Compassionate Care, Anytime.
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Smarter Access to Healthcare
                <br />
                <span className="text-sky-400">— Anytime, Anywhere</span>
              </h1>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md">
                Book appointments, consult doctors, and manage your health—all from one simple platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-sky-600 text-white hover:bg-sky-700"
                >
                  <Link href="/onboarding">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-sky-600/20 border border-sky-400/30 text-sky-100 hover:bg-sky-800/40 transition-colors"
                >
                  <Link href="/doctors">
                    Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }}
            >
              <Image
                src="/banner3.png"
                alt="Doctor illustration"
                width={500}
                height={500}
                className="object-contain drop-shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Access care in minutes — it’s fast, simple, and secure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-sky-900/20 hover:border-sky-800/40 transition-all duration-300">
                  <CardHeader className='pb-2'>
                    <div className="bg-sky-300/20 p-3 rounded-lg w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section className="py-20 bg-muted/30" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-sky-900/30 border-sky-700/30 px-4 py-2 text-sky-200 text-sm font-medium">
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-4">Consultation Packages</h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Pick a package that fits your medical needs with flexibility and clarity.
            </p>
          </div>
          <Pricing/>
          <Card className="mt-12 bg-muted/20 border-sky-600/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-sky-400" />How Our Credit System Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-3 mt-1 bg-sky-900/20 p-1 rounded-full">
                      <Check className="h-4 w-4 text-sky-400" />
                    </div>
                    <p className="text-slate-400" dangerouslySetInnerHTML={{ __html: benefit }}></p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section className="py-20 bg-muted/30" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-sky-900/30 border-sky-700/30 px-4 py-3 text-sky-200 text-sm font-medium">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-4">What Our Users Say</h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md mx-auto">
              Real experiences from real patients and healthcare providers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-sky-900/20 hover:border-sky-800/40 transition-all duration-300">
                  <CardContent>
                    <div className="pt-2"><span>{testimonial.initials}</span></div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-slate-400">{testimonial.role}</p>
                    </div>
                    <p className="text-slate-300 mt-4 text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="py-20 bg-muted/30" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
        <div className="container mx-auto px-4">
          <Card className="bg-sky-900/20 border border-sky-700/20 shadow-lg hover:shadow-sky-800/30 transition-shadow duration-300">
            <CardContent className="p-8 md:p-12 lg:p-16 space-y-8">
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to simplify your healthcare journey?
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  Join thousands who’ve made their health a priority—smart, seamless, and just a few clicks away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="bg-sky-700 text-sky-100 hover:bg-sky-800"
                  >
                    <Link href="/sign-up">Sign Up Now</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-sky-600/20 border border-sky-400/30 text-sky-100 hover:bg-sky-800/40 transition-colors"
                  >
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
