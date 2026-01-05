import {  CheckCircle, ArrowRight } from "lucide-react"
import { 
  
   
  Clock, 
  
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import s1 from '@/assets/s1.png';
import s2 from '@/assets/s2.png';
import s3 from '@/assets/s3.png';
import s4 from '@/assets/s4.png';
import s5 from '@/assets/s5.png';
import s6 from '@/assets/s6.png';
import s7 from '@/assets/s7.png';
import s8 from '@/assets/s8.png';
import s9 from '@/assets/s9.png';
import s10 from '@/assets/s10.png'


import { Badge } from "../components/ui/badge"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";


export default function ServicesPage() {
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
  const services=[
    
  { 
    icon: s1, 
    title: "Manpower Supply", 
    desc: "Skilled professionals for your business needs", 
    color: "blue", 
    features: ["Certified Technicians", "24/7 Availability", "Quality Assurance"], 
  },
  { 
    icon: s2, 
    title: "Maintenance Services", 
    desc: "Professional facility and equipment maintenance", 
    color: "green", 
    features: ["Preventive Maintenance", "Emergency Repairs", "Equipment Upgrades"], 
  },
  { 
    icon: s3, 
    title: "Telecommunication", 
    desc: "Cutting-edge communication solutions", 
    color: "purple", 
    features: ["Network Setup", "System Integration", "Technical Support"], 
  },
  { 
    icon: s4, 
    title: "Civil & Construction Services", 
    desc: "Comprehensive civil works with structural design, plumbing, electrical installations, and supervision.", 
    color: "orange", 
    features: ["Structural Design", "Plumbing", "Electrical Installations", "Site Supervision"], 
  },
  { 
    icon: s5, 
    title: "Waterproofing Solutions", 
    desc: "Protect property with advanced waterproofing techniques for rooftops, basements, tanks, and bathrooms.", 
    color: "blue", 
    features: ["Roof Waterproofing", "Basement Protection", "Long-lasting Durability"], 
  },
  { 
    icon: s6, 
    title: "Swimming Pool Maintenance", 
    desc: "Crystal-clear pools with cleaning, chemical balancing, filtration, and repair services.", 
    color: "purple", 
    features: ["Pool Cleaning", "Filtration & Chemicals", "Repair Services"], 
  },
  { 
    icon: s7, 
    title: "Elevator & Escalator Maintenance", 
    desc: "Stay safe with AMC and on-demand services for inspections, repairs, and smooth operations.", 
    color: "red", 
    features: ["Emergency Repairs", "Regular Inspections", "AMC Services"], 
  },
  { 
    icon: s8, 
    title: "Fit-Out Works in Firefighting Systems", 
    desc: "Fire safety solutions with extinguishers, sprinkler systems, and alarm installations.", 
    color: "orange", 
    features: ["Sprinkler Systems", "Fire Extinguishers", "Alarm Installations"], 
  },
  { 
    icon: s9, 
    title: "IT Services", 
    desc: "From network setups to cybersecurity and helpdesk support, ensuring secure and seamless operations.", 
    color: "green", 
    features: ["Cybersecurity", "Helpdesk Support", "Network Setup"], 
  },
  {
    icon: s10,
    title: "Technical Services",
    desc: "We provide high-quality technical support including MEP services, skilled technicians, AMCs, and quality audits for optimal operations.",
    color: "yellow",  
    features: ["MEP Services", "Skilled Technicians", "AMCs", "Quality Audits"],
  }
]
  return (
    <div className="bg-gradient-to-br from-[#f5f7fa] to-[#cfd9df]">
      {/* Hero Section for Services Page */}
     
       <section
      className="py-20 bg-gradient-to-br from-[#f5f7fa] to-[#cfd9df]"
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
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold border-0">
           Our Expertise
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl lg:text-5xl font-bold text-slate-900"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
         Comprehensive Technical Services
        </motion.h1>

        <motion.p
          className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        > We offer a wide range of professional services designed to meet your business needs and drive operational
            excellence.
         
        </motion.p>
      </motion.div>
    </section>
      
      

{/* Services Grid */}
      {/* Services Grid */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-stretch">
    {services.map((service, idx) => (
      <Card
        key={service.title}
        className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white hover:scale-[1.02] rounded-2xl h-full flex flex-col justify-between"
      >
        <CardHeader className="pb-4 flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 bg-${service.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
          >
            <img
              src={service.icon}
              alt={service.title}
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-lg md:text-xl font-bold text-slate-900 mb-2">
            {service.title}
          </CardTitle>
          <CardDescription className="text-slate-600 text-sm md:text-base leading-relaxed">
            {service.desc}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow justify-between">
          <ul className="space-y-2 mb-6">
            {service.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-slate-600 text-sm"
              >
                <CheckCircle className={`w-4 h-4 text-${service.color}-500`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
        </CardContent>
      </Card>
    ))}
  </div>
</div>

      

      {/* CTA Section (reused from Home/About) */}
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
