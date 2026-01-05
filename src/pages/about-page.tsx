import { CheckCircle, Users, Target, Award, Shield, Lightbulb } from "lucide-react"
import { 
  ArrowRight, 
   
  Clock, 
  
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button"

import { Card ,CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export default function AboutPage() {
  const scaleMV = useMotionValue(0.8);
  const rotateXMV = useMotionValue(0);

  const scale = useSpring(useTransform(scaleMV, [0, 1], [0.8, 1]), {
    stiffness: 120,
    damping: 10,
  });

  const rotateX = useSpring(useTransform(rotateXMV, [0, 50], [0, 10]), {
    stiffness: 100,
    damping: 10,
  });

  return (
    <div className=" bg-gradient-to-br from-[#f5f7fa] to-[#e9ecef]">
      
      {/* Hero Section */}
      <section
        className="py-5"
        onMouseEnter={() => {
          scaleMV.set(1);
          rotateXMV.set(50);
        }}
        onMouseLeave={() => {
          scaleMV.set(0.8);
          rotateXMV.set(0);
        }}
      >
        <motion.div
          style={{ scale, rotateX }}
          className="container mx-auto px-4 text-center space-y-6"
        >
          <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <Badge className="bg-[#0056A4]/10 text-[#0056A4] px-4 py-2 text-sm font-semibold border-0">
              About Us
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-slate-900"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            About DNR Technical Services
          </motion.h1>

          <motion.p
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            We go beyond recruitment — we create success stories through excellence, reliability, and innovation.
          </motion.p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Our Story</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  At DNR Technical Services, we go beyond recruitment—we create success stories. Our company is dedicated to providing top-tier manpower supply, professional maintenance services, and cutting-edge telecommunication solutions to businesses across various industries.
                </p>
                <p>
                  With a strong commitment to excellence, reliability, and innovation, we connect skilled professionals with the right opportunities, ensuring seamless operations and business growth.
                </p>
                <p>
                  Our mission is to empower businesses with skilled manpower and professional services that enhance productivity and operational excellence.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0056A4]">500+</div>
                  <div className="text-slate-600 font-medium">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF8A1D]">24/7</div>
                  <div className="text-slate-600 font-medium">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-slate-600 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Image + Badges */}
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <img
                  src="/techi.jpeg"
                  alt="Professional technician"
                  className="object-cover w-full h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <Badge className="bg-[#0056A4] text-white border-0 px-3 py-1 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Certified Professionals
                  </Badge>
                </div>
                <div className="absolute bottom-6 right-6">
                  <Badge className="bg-[#FF8A1D] text-white border-0 px-3 py-1 font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" /> Award Winning
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-br from-[#f5f7fa] to-[#e9ecef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#FF8A1D]/10 text-[#FF8A1D] px-4 py-2 text-sm font-semibold">Our Foundation</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              These values guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Integrity", desc: "We prioritize honesty and transparency in all our services." },
              { icon: Target, title: "Excellence", desc: "We strive to deliver top-quality solutions that exceed expectations." },
              { icon: CheckCircle, title: "Reliability", desc: "Our workforce ensures smooth and uninterrupted operations." },
              { icon: Lightbulb, title: "Innovation", desc: "We adapt and improve to provide the best possible solutions." },
            ].map((value) => (
              <Card key={value.title} className="group text-center hover:scale-105 hover:shadow-xl transition-all">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-[#0056A4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <value.icon className="w-8 h-8 text-[#0056A4]" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#0056A4]/10 text-[#0056A4] px-4 py-2 text-sm font-semibold">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">What Sets Us Apart</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We combine expertise, reliability, and innovation to deliver exceptional results for our clients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Expert Team", desc: "Our certified professionals bring years of experience and expertise to every project." },
              { icon: Award, title: "Quality Assurance", desc: "We maintain the highest standards of quality in all our services." },
              { icon: CheckCircle, title: "Client-Focused", desc: "Your success is our priority. We work closely with you to achieve your goals." },
            ].map((feature) => (
              <Card key={feature.title} className="text-center p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-[#FF8A1D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-[#FF8A1D]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-[#0056A4] to-[#003C7A] text-white">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                  <Badge className="bg-white/20 text-white border border-white/30 px-4 py-2 text-sm font-semibold">
                    Ready to Transform?
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Ready to Transform Your Business?</h2>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Let's discuss how our technical services can drive your business forward. Contact us today for a
                    customized solution that delivers results.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
          size="lg"
          className="bg-white text-[#0056A4] hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          asChild
        >
          <Link to="/contact-us">
            <Clock className="w-5 h-5 mr-2" />
            Get Started Today
          </Link>
        </Button>
                    <Button
  size="lg"
  variant="outline"
  className="border-2 border-white text-white hover:bg-white hover:text-[#0056A4] bg-transparent font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
  asChild
>
  <Link to="/about">
    Learn More
    <ArrowRight className="w-5 h-5 ml-2" />
  </Link>
</Button>

                  </div>
                </div>
              </div>
            </section>
     
    </div>
  )
}
