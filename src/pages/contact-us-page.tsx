import { Mail, Phone, MapPin, Send, ArrowRight, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ContactUsPage() {
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

  // form states
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // validation
  const validate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      // reset form
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className=" bg-gradient-to-b from-white to-[#f5f7fa]">
      {/* Hero Section */}
      <section
        className="py-20 bg-gradient-to-r from-[#1E2A40] to-[#1E2A44]"
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
            <Badge className="bg-yellow-400  text-black px-4 py-2 text-sm font-semibold border-0 shadow-sm">
              Get in Touch
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Contact DNR Technical Services
          </motion.h1>

          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            We're here to help! Reach out to us for inquiries, support, or to
            discuss your project needs.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Information Section */}
<section className="py-20 bg-gradient-to-b from-white to-[#f5f7fa]">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: <Phone className="w-8 h-8 text-blue-600" />,
          title: "Call Us",
          text: "+971 565025206",
          btn: (
            <a href="tel:+971565025206" className="inline-block">
              <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-md hover:shadow-lg active:shadow-sm transition-all transform hover:scale-105 active:scale-95">
                Call Now
              </Button>
            </a>
          ),
        },
        {
          icon: <Mail className="w-8 h-8 text-blue-600" />,
          title: "Email Us",
          text: "info@dnrtechnicalservices.com",
          btn: (
            <a
              href="mailto:info@dnrtechnicalservices.com"
              className="inline-block"
            >
              <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-md hover:shadow-lg active:shadow-sm transition-all transform hover:scale-105 active:scale-95">
                Send Email
              </Button>
            </a>
          ),
        },
        {
          icon: <MapPin className="w-8 h-8 text-blue-600" />,
          title: "Our Location",
          text: "Dubai, United Arab Emirates",
          btn: (
            <a
              href="https://www.google.com/maps/place/Dubai,+United+Arab+Emirates/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-md hover:shadow-lg active:shadow-sm transition-all transform hover:scale-105 active:scale-95">
                View Map
              </Button>
            </a>
          ),
        },
      ].map((item, idx) => (
        <Card
          key={idx}
          className="text-center p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] rounded-2xl"
        >
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {item.icon}
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 text-lg mb-4">{item.text}</p>
            {item.btn}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>



      {/* Contact Form Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl relative">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
              Send Us a Message
            </h2>
            <p className="text-center text-slate-600 mb-8">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>

            {success && (
              <div className="absolute top-4 right-4 bg-blue-300 text-blue-800 px-4 py-2 rounded-lg shadow-md">
                ✅ Message Sent Successfully!
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.subject ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Inquiry about services"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.message ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Your message here..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0056A4] to-[#003C7A] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-white/20 text-white border border-white/30 px-4 py-2 text-sm font-semibold">
              Ready to Transform?
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Let's discuss how our technical services can drive your business
              forward. Contact us today for a customized solution that delivers
              results.
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
