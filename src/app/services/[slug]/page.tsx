'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, ArrowRight, CheckCircle2, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { motion } from 'framer-motion'

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services/${slug}`)
        const data = await res.json()
        setService(data)
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Button asChild><Link href="/services">Back to Services</Link></Button>
        </div>
      </div>
    )
  }

  const benefits = Array.isArray(service.benefits) ? service.benefits : []
  const process = Array.isArray(service.process) ? service.process : []
  const faqs = Array.isArray(service.faq) ? service.faq : []

  return (
    <div>
      {/* Banner */}
      <section className="relative h-64 md:h-96 bg-gradient-to-r from-blue-600 to-indigo-700">
        {service.banner ? (
          <Image src={service.banner} alt={service.title} fill className="object-cover opacity-40" />
        ) : service.image ? (
          <Image src={service.image} alt={service.title} fill className="object-cover opacity-40" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{service.title}</h1>
            {service.shortDesc && (
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">{service.shortDesc}</p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {service.fullDesc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-line">
                  {service.fullDesc}
                </div>
              </motion.div>
            )}

            {/* Service Image */}
            {service.showImage && service.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden h-64 md:h-80"
              >
                <Image src={service.image} alt={service.title} width={800} height={400} className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">
                        {typeof benefit === 'string' ? benefit : benefit.title || benefit.text || JSON.stringify(benefit)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Process */}
            {process.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Process</h2>
                <div className="space-y-4">
                  {process.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-bold text-sm">{i + 1}</span>
                      </div>
                      <div className="pt-2">
                        <h3 className="font-semibold text-gray-900">
                          {typeof step === 'string' ? step : step.title || step.step || `Step ${i + 1}`}
                        </h3>
                        {(typeof step !== 'string' && step.desc) && (
                          <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq: any, i: number) => {
                    const question = typeof faq === 'string' ? faq : faq.question || faq.q || ''
                    const answer = typeof faq !== 'string' ? faq.answer || faq.a || '' : ''
                    if (!question) return null
                    return (
                      <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-4">
                        <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                          {question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {answer}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white sticky top-24"
            >
              <h3 className="text-xl font-bold mb-3">Need This Service?</h3>
              <p className="text-blue-100 text-sm mb-6">
                Get a free quote for {service.title}. Our team will get back to you within 24 hours.
              </p>
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 mb-3">
                <Link href="/contact">Get Free Quote</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white/10">
                <a href="tel:+918340323153">
                  <Phone className="mr-2 h-4 w-4" /> Call Us Now
                </a>
              </Button>
            </motion.div>

            {/* Quick Features */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Features</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'Fully Insured' },
                  { icon: Clock, text: 'On-Time Delivery' },
                  { icon: CheckCircle2, text: 'Expert Handling' },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-3 text-sm text-gray-600">
                    <f.icon className="h-4 w-4 text-blue-600" />
                    {f.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
