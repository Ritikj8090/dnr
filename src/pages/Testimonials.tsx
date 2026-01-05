import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../lib/motion";

// Define testimonial type
interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajeev Malhotra, Facility Manager, UrbanEdge Towers",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "Professional, punctual, and highly skilled! The team handled our waterproofing and elevator maintenance flawlessly. Zero complaints!",
  },
  {
    id: 2,
    name: "Nikita Sharma, Operations Head, NexaBiz Solutions",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Impressed by their civil work and IT setup. Smooth project delivery and excellent technical support. Highly recommend!",
  },
  {
    id: 3,
    name: "Ankur Mehta, Admin Lead, BrightCore Enterprises",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    text: "Their team transformed our workspace with top-notch fit-out and fire safety installations. Truly dependable and detail-oriented service!",
  },
  {
    id: 4,
    name: "Shruti Verma, Project Manager, TechNova Infra Pvt. Ltd.",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    text: "Excellent technical service support! From IT networking to MEP work, everything was executed seamlessly. Will definitely collaborate again.",
  },
];


const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 px-4 max-w-7xl mx-auto">
      <motion.div variants={fadeIn("up", 0.3)} className="text-center mb-12">
        <motion.h2
          variants={textVariant(0.2)}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          What our happy client say
        </motion.h2>
        <motion.p
          variants={fadeIn("up", 0.4)}
          className="text-gray-600"
        >
          Things that make it the best place to start trading
        </motion.p>
      </motion.div>

      <motion.div variants={fadeIn("up", 0.5)} className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonials-swiper md:mb-12"
        >
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <SwiperSlide key={testimonial.id} className="h-full md:py-12 py-4">
              <motion.div
                variants={fadeIn("up", 0.3 * (index + 1))}
                className="text-center bg-white p-4 rounded-lg shadow-md h-full flex flex-col"
              >
                <motion.div
                  variants={fadeIn("down", 0.4 * (index + 1))}
                  className="w-24 h-24 mx-auto mb-4"
                >
                  <motion.img
                    variants={fadeIn("up", 0.5 * (index + 1))}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </motion.div>

                <motion.div
                  variants={fadeIn("up", 0.4 * (index + 1))}
                  className="flex justify-center mb-2"
                >
                  {[...Array(5)].map((_, starIndex) => (
                    <motion.span
                      key={starIndex}
                      variants={fadeIn("up", 0.1 * starIndex)}
                      className="text-blue-600"
                    >
                      ★
                    </motion.span>
                  ))}
                </motion.div>

                <motion.h3
                  variants={textVariant(0.3)}
                  className="font-semibold text-xl mb-3"
                >
                  {testimonial.name}
                </motion.h3>
                <motion.p
                  variants={fadeIn("up", 0.6 * (index + 1))}
                  className="text-gray-600"
                >
                  {testimonial.text}
                </motion.p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <motion.div
          variants={fadeIn("up", 0.7)}
          className="flex justify-center gap-4 mt-8"
        >
          <motion.button
            variants={fadeIn("right", 0.8)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="swiper-button-prev-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
          >
            <BsChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            variants={fadeIn("left", 0.8)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="swiper-button-next-custom w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
          >
            <BsChevronRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection; 