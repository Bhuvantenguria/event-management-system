import React from "react";
import { AnnouncementsBanner } from "@/components/home/announcements-banner";
import { HeroSection } from "@/components/home/hero-section";
import { AboutEditorial } from "@/components/home/about-editorial";
import { ClubsShowcase } from "@/components/home/clubs-showcase";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedEvents } from "@/components/home/featured-events";
import { SchedulePreview } from "@/components/home/schedule-preview";
import { CulturalShowcase } from "@/components/home/cultural-showcase";
import { SportsSpotlight } from "@/components/home/sports-spotlight";
import { PreviousEditionsPreview } from "@/components/home/previous-editions-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { FaqAccordion } from "@/components/home/faq-accordion";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. Announcements – Campus Live Bulletin */}
      <AnnouncementsBanner />

      {/* 2. Hero – Inter-Collegiate Fest Introduction */}
      <HeroSection />

      {/* 3. About – College Fest Movement & Student Bodies */}
      <AboutEditorial />

      {/* 4. Clubs Showcase – The 7 Student Cultural Societies Powering the Fest */}
      <ClubsShowcase />

      {/* 5. Categories – Arena Disciplines & Trophies */}
      <CategoryShowcase />

      {/* 6. Events – Club-Hosted Competitions with Instant Register */}
      <FeaturedEvents />

      {/* 7. Schedule – 4-Day Interactive Fest Timeline */}
      <SchedulePreview />

      {/* 8. Cultural Experiences – Uttar Pradesh Heritage Storytelling */}
      <CulturalShowcase />

      {/* 9. Sports – Chhatrapati Shivaji Football & Sports Arena */}
      <SportsSpotlight />

      {/* 10. Previous Editions – Cinematic Year-Wise Memories & Champions */}
      <PreviousEditionsPreview />

      {/* 11. Gallery – Immersive Masonry & Lightbox Gallery */}
      <GalleryPreview />

      {/* 12. Sponsors – Partners, Patrons & Paytm QR Payments */}
      <SponsorsSection />

      {/* 13. Clarifications & Guidelines FAQ */}
      <FaqAccordion />
    </div>
  );
}
