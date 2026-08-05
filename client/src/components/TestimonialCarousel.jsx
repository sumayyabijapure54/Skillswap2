import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Reused on the Home community section and on MentorProfile — pass any
// array shaped like { text, author, rating }.
export default function TestimonialCarousel({ testimonials = [], className = '' }) {
  if (!testimonials.length) return null;

  const canLoop = testimonials.length > 2;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: Math.min(2, testimonials.length) },
        980: { slidesPerView: Math.min(3, testimonials.length) }
      }}
      autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      pagination={{ clickable: true }}
      navigation
      loop={canLoop}
      observer
      observeParents
      className={`testimonial-swiper ${className}`}
    >
      {testimonials.map((t, i) => (
        <SwiperSlide key={i}>
          <div className="quote">
            <p>"{t.text}"</p>
            <div className="who"><span>{t.author}</span><span>{'★'.repeat(t.rating || 5)}</span></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
