"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Each slide: background image, title, short text, and a "Browse Books" button.
const slides = [
  {
    id: 1,
    image: "/1.png",
    title: "Find your next read in minutes",
    text: "Browse every book shared by our readers, from classic fiction to science and history.",
    bg: "from-[#0f3d3e] to-[#16595a]",
  },
  {
    id: 2,
    image: "/2.png",
    title: "Borrow a book for a few days",
    text: "Pick a title, confirm in one click, and keep it for a week. Return it when you are done.",
    bg: "from-[#2b2d5b] to-[#40448a]",
  },
  {
    id: 3,
    image: "/3.png",
    title: "Got books on your shelf? Share them",
    text: "Add your own books to BookNook so other readers can borrow them, and track every copy.",
    bg: "from-[#4a2c3d] to-[#6b3a52]",
  },
];

export default function Hero() {
  return (
    <section aria-label="Welcome to BookNook" className="w-full">
      <h1 className="sr-only">BookNook — your online book library</h1>

      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        speed={700}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        className="booknook-hero"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative isolate flex min-h-[420px] items-center overflow-hidden bg-gradient-to-br ${slide.bg} text-white md:min-h-[520px]`}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                preload={slide.id === 1}
                sizes="100vw"
                className="object-cover"
              />

              {/* Overlays keep the text readable over the photos */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"
              />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:px-12">
                <div className="max-w-xl">
                  <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-md text-base text-white/85 md:text-lg">
                    {slide.text}
                  </p>
                  <Link
                    href="/All-Books"
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_-12px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    Browse Books
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Style Swiper's arrows and dots to match the hero */}
      <style jsx global>{`
        .booknook-hero .swiper-button-next,
        .booknook-hero .swiper-button-prev {
          color: #fff;
          transform: scale(0.7);
        }
        .booknook-hero .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.6;
        }
        .booknook-hero .swiper-pagination-bullet-active {
          opacity: 1;
        }
        @media (max-width: 640px) {
          .booknook-hero .swiper-button-next,
          .booknook-hero .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
