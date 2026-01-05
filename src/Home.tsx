import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";

import s1 from '@/assets/s1.png';
import s2 from '@/assets/s2.png';
import s3 from '@/assets/s3.png';
import s4 from '@/assets/s4.png';
import s5 from '@/assets/s5.png';
import s6 from '@/assets/s6.png';
import s7 from '@/assets/s7.png';
import s8 from '@/assets/s8.png';
import s9 from '@/assets/s9.png';
import { useState, useRef, useEffect } from "react";
import TestimonialsSection from "./pages/Testimonials";

import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { motion,useAnimation, type AnimationControls } from "framer-motion";
import CountUp from "react-countup";

import "./Hero.css";

export default function HomePage() {
  const projectRef = useRef<AnimationControls>(useAnimation());
  const supportRef = useRef<AnimationControls>(useAnimation());
  const satisfactionRef = useRef<AnimationControls>(useAnimation());

  useEffect(() => {
    const loopAnimation = () => {
      projectRef.current?.start();
      supportRef.current?.start();
      satisfactionRef.current?.start();
    };
    loopAnimation();
    const interval = setInterval(loopAnimation, 4000);
    return () => clearInterval(interval);
  }, []);

  const [showAll, setShowAll] = useState(false);
  
  const services = [
    { icon: s1, title: "Manpower Supply", desc: "Skilled professionals for your business needs", features: ["Certified Technicians", "24/7 Availability", "Quality Assurance"], },
    { icon: s2, title: "Maintenance Services", desc: "Professional facility and equipment maintenance", features: ["Preventive Maintenance", "Emergency Repairs", "Equipment Upgrades"], },
    { icon: s3, title: "Telecommunication", desc: "Cutting-edge communication solutions", features: ["Network Setup", "System Integration", "Technical Support"], },
    { icon: s4, title: "Civil & Construction Services", desc: "Comprehensive civil works with structural design, plumbing, electrical installations, and supervision.", features: ["Structural Design", "Plumbing", "Electrical Installations", "Site Supervision"], },
    { icon: s5, title: "Waterproofing Solutions", desc: "Protect property with advanced waterproofing techniques for rooftops, basements, tanks, and bathrooms.", features: ["Roof Waterproofing", "Basement Protection", "Long-lasting Durability"], },
    { icon: s6, title: "Swimming Pool Maintenance", desc: "Crystal-clear pools with cleaning, chemical balancing, filtration, and repair services.", features: ["Pool Cleaning", "Filtration & Chemicals", "Repair Services"], },
    { icon: s7, title: "Elevator & Escalator Maintenance", desc: "Stay safe with AMC and on-demand services for inspections, repairs, and smooth operations.", features: ["Emergency Repairs", "Regular Inspections", "AMC Services"], },
    { icon: s8, title: "Fit-Out Works in Firefighting Systems", desc: "Fire safety solutions with extinguishers, sprinkler systems, and alarm installations.", features: ["Sprinkler Systems", "Fire Extinguishers", "Alarm Installations"], },
    { icon: s9, title: "IT Services", desc: "From network setups to cybersecurity and helpdesk support, ensuring secure and seamless operations.", features: ["Cybersecurity", "Helpdesk Support", "Network Setup"], }
  ];
   
  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-[#f8f9fa]">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
       
       < div className="absolute inset-0 overflow-hidden"> <div className="absolute top-24 left-10 text-blue-500 opacity-60 text-6xl float-icon">⚙️</div> <div className="absolute bottom-16 right-16 text-purple-500 opacity-20 text-6xl float-icon">📡</div> <div className="absolute top-1/2 left-1/4 text-green-500 opacity-20 text-6xl float-icon">🛠</div> <div className="absolute top-24 right-10 text-blue-500 opacity-60 text-6xl float-icon">⚙️</div> <div className="absolute top-1/2 left-16 text-purple-500 opacity-20 text-6xl float-icon">📡</div> <div className="absolute bottom-16 right-1/4 text-green-500 opacity-20 text-6xl float-icon">🛠</div> </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              FIND YOUR{" "}
              <span className="bg-gradient-to-r from-[#0056A4] to-[#FF8A1D] bg-clip-text text-transparent block">
                HUMAN POWER
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >At DNR Technical Services, we specialize in providing skilled and reliable manpower to help businesses thrive. With a commitment to excellence, we connect the right talent with the right opportunities, ensuring efficiency and success in every industry we serve.
            </motion.p>
            
            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
  size="lg"
  className="!bg-[#0056A4] hover:!bg-[#002d56] text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
  asChild
>
  <Link to="/services">
    <PlayCircle className="w-5 h-5 mr-3" />
    Explore Services
  </Link>
</Button>
              <Button
  size="lg"
  variant="outline"
  className="border-2 border-[#0056A4] text-[#0056A4] hover:bg-[#0056A4] hover:text-white px-8 py-4 rounded-lg transition-all hover:scale-105"
  asChild
>
  <Link to="/contact-us">
    Contact Expert
    <ArrowRight className="w-5 h-5 ml-3" />
  </Link>
</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200 w-full max-w-2xl">
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#0056A4]">
                  <CountUp end={500} duration={2.5} suffix="+" />
                </div>
                <div className="text-slate-600 font-medium">Projects</div>
              </div>
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#FF8A1D]">24/7</div>
                <div className="text-slate-600 font-medium">Support</div>
              </div>
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#003C7A]">
                  <CountUp end={100} duration={2.5} suffix="%" />
                </div>
                <div className="text-slate-600 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-[#0056A4] px-4 py-2 text-sm font-semibold">Our Services</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Comprehensive Technical Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From manpower supply to maintenance services and telecommunication solutions, we cover all your technical
              needs with professional expertise.
            </p>
          </div>

          {/* Service Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleServices.map((service) => (
                <Card
                  key={service.title}
                  className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-slate-200 shadow-md bg-white hover:scale-[1.02] rounded-xl"
                >
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <img src={service.icon} alt={service.title} className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                      {service.desc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#0056A4] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/services">
      <Button className="w-full bg-[#2a3e6e] hover:bg-[#1d2d4f] text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm py-2">
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-full bg-[#0056A4] text-white hover:bg-[#003C7A] transition"
            >
              {showAll ? "View Less" : "View More"}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
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
  );
}
/* import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  PlayCircle
} from "lucide-react";
import s1 from '@/assets/s1.png';
import s2 from '@/assets/s2.png';
import s3 from '@/assets/s3.png';
import s4 from '@/assets/s4.png';
import s5 from '@/assets/s5.png';
import s6 from '@/assets/s6.png';
import s7 from '@/assets/s7.png';
import s8 from '@/assets/s8.png';
import s9 from '@/assets/s9.png';
import { useState, useRef, useEffect } from "react";
import TestimonialsSection from "./pages/Testimonials";

import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { motion,useAnimation, type AnimationControls } from "framer-motion";
import CountUp from "react-countup";

import "./Hero.css";

export default function HomePage() {
  const projectRef = useRef<AnimationControls>(useAnimation());
  const supportRef = useRef<AnimationControls>(useAnimation());
  const satisfactionRef = useRef<AnimationControls>(useAnimation());

  useEffect(() => {
    const loopAnimation = () => {
      projectRef.current?.start();
      supportRef.current?.start();
      satisfactionRef.current?.start();
    };
    loopAnimation();
    const interval = setInterval(loopAnimation, 4000);
    return () => clearInterval(interval);
  }, []);

  const [showAll, setShowAll] = useState(false);
  
  const services = [
    { icon: s1, title: "Manpower Supply", desc: "Skilled professionals for your business needs", features: ["Certified Technicians", "24/7 Availability", "Quality Assurance"], },
    { icon: s2, title: "Maintenance Services", desc: "Professional facility and equipment maintenance", features: ["Preventive Maintenance", "Emergency Repairs", "Equipment Upgrades"], },
    { icon: s3, title: "Telecommunication", desc: "Cutting-edge communication solutions", features: ["Network Setup", "System Integration", "Technical Support"], },
    { icon: s4, title: "Civil & Construction Services", desc: "Comprehensive civil works with structural design, plumbing, electrical installations, and supervision.", features: ["Structural Design", "Plumbing", "Electrical Installations", "Site Supervision"], },
    { icon: s5, title: "Waterproofing Solutions", desc: "Protect property with advanced waterproofing techniques for rooftops, basements, tanks, and bathrooms.", features: ["Roof Waterproofing", "Basement Protection", "Long-lasting Durability"], },
    { icon: s6, title: "Swimming Pool Maintenance", desc: "Crystal-clear pools with cleaning, chemical balancing, filtration, and repair services.", features: ["Pool Cleaning", "Filtration & Chemicals", "Repair Services"], },
    { icon: s7, title: "Elevator & Escalator Maintenance", desc: "Stay safe with AMC and on-demand services for inspections, repairs, and smooth operations.", features: ["Emergency Repairs", "Regular Inspections", "AMC Services"], },
    { icon: s8, title: "Fit-Out Works in Firefighting Systems", desc: "Fire safety solutions with extinguishers, sprinkler systems, and alarm installations.", features: ["Sprinkler Systems", "Fire Extinguishers", "Alarm Installations"], },
    { icon: s9, title: "IT Services", desc: "From network setups to cybersecurity and helpdesk support, ensuring secure and seamless operations.", features: ["Cybersecurity", "Helpdesk Support", "Network Setup"], }
  ];
   
  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">

      
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-[#f8f9fa]">
      div className="absolute inset-0 overflow-hidden"> <div className="absolute top-24 left-10 text-blue-500 opacity-60 text-6xl float-icon">⚙️</div> <div className="absolute bottom-16 right-16 text-purple-500 opacity-20 text-6xl float-icon">📡</div> <div className="absolute top-1/2 left-1/4 text-green-500 opacity-20 text-6xl float-icon">🛠</div> <div className="absolute top-24 right-10 text-blue-500 opacity-60 text-6xl float-icon">⚙️</div> <div className="absolute top-1/2 left-16 text-purple-500 opacity-20 text-6xl float-icon">📡</div> <div className="absolute bottom-16 right-1/4 text-green-500 opacity-20 text-6xl float-icon">🛠</div> </div>
        
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-[28rem] h-[28rem] bg-orange-200/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              Excellence in{" "}
              <span className="bg-gradient-to-r from-[#0056A4] to-[#FF8A1D] bg-clip-text text-transparent block">
                Technical Solutions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              We go beyond recruitment—we create success stories. Providing top-tier manpower supply, professional
              maintenance services, and cutting-edge telecommunication solutions to businesses across various
              industries.
            </motion.p>
            
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="!bg-[#FF8A1D] hover:!bg-[#e67300] text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <PlayCircle className="w-5 h-5 mr-3" />
                Explore Services
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#0056A4] text-[#0056A4] hover:bg-[#0056A4] hover:text-white px-8 py-4 rounded-lg transition-all hover:scale-105"
              >
                Contact Expert
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>

            
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200 w-full max-w-2xl">
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#0056A4]">
                  <CountUp end={500} duration={2.5} suffix="+" />
                </div>
                <div className="text-slate-600 font-medium">Projects</div>
              </div>
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#FF8A1D]">24/7</div>
                <div className="text-slate-600 font-medium">Support</div>
              </div>
              <div className="text-center hover:scale-105 transition">
                <div className="text-3xl font-bold text-[#003C7A]">
                  <CountUp end={100} duration={2.5} suffix="%" />
                </div>
                <div className="text-slate-600 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section id="services" className="py-20 bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-[#0056A4] px-4 py-2 text-sm font-semibold">Our Services</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Comprehensive Technical Solutions</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From manpower supply to maintenance services and telecommunication solutions, we cover all your technical
              needs with professional expertise.
            </p>
          </div>

          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleServices.map((service) => (
                <Card
                  key={service.title}
                  className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-slate-200 shadow-md bg-white hover:scale-[1.02] rounded-xl"
                >
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <img src={service.icon} alt={service.title} className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                      {service.desc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#0056A4] flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-[#FF8A1D] hover:bg-[#e67300] text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm py-2">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-full bg-[#0056A4] text-white hover:bg-[#003C7A] transition"
            >
              {showAll ? "View Less" : "View More"}
            </button>
          </div>
        </div>
      </section>

      
      <TestimonialsSection />

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
              >
                <Clock className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#0056A4] bg-transparent font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
*/
