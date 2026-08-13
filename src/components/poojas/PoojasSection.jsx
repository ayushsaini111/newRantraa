"use client";

import { useState, useEffect } from "react";
import OnlineSection from "./OnlineSection";
import OnsiteSection from "./OnsiteSection";

export default function PoojasSection() {
  const [onlinePoojas, setOnlinePoojas] = useState([]);
  const [onsitePoojas, setOnsitePoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        // Fetch online poojas
        const onlineRes = await fetch('/backend/poojas?category=online');
        const onlineData = await onlineRes.json();
        
        // Fetch onsite poojas
        const onsiteRes = await fetch('/backend/poojas?category=onsite');
        const onsiteData = await onsiteRes.json();

        setOnlinePoojas(onlineData);
        setOnsitePoojas(onsiteData);
      } catch (error) {
        console.error('Error fetching poojas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoojas();
  }, []);

  if (loading) {
    return (
      <section className="py-s104">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
        </div>
      </section>
    );
  }

  const onlineData = {
    title: "Online",
    description: "If you don't have time to perform pooja at home, book a virtual pooja with experienced Pandit Ji. Participate live from anywhere with complete guidance and receive divine blessings without leaving your home.",
    cards: onlinePoojas
  };

  const onsiteData = {
    title: "On-site",
    description: "If you want a hassle-free pooja at your home, book an on-site pooja. Our Pandit Ji will visit with complete pooja samagri and perform every ritual according to Vedic traditions.",
    feature: {
      title: "100% Hassle-Free",
      description: "No arrangements needed. Pandit Ji arrives with all required pooja samagri."
    },
    cards: onsitePoojas
  };

  return (
    <section className="py-s104">
      {/* Header */}
      <div
        className="
          flex
          flex-col
          items-center
          text-center
          gap-s16
          max-w-3xl
          mx-auto
        "
      >
        <span
          className="
            caption
            uppercase
            tracking-[3px]
            text-primary-main
            font-semibold
          "
        >
          Sacred Rituals
        </span>

        <h2 className="heading-h1 text-main">
          Popular Poojas
        </h2>

        <p className="body-large text-secondary">
          Discover the most loved Vedic rituals performed by experienced
          Pandit Ji. Choose between Online participation from anywhere or
          hassle-free On-site pooja at your home.
        </p>
      </div>

      <div className=" mx-auto pl-4 lg:pl-s0 ">
        {/* Sections */}
        <div className="mt-s104 flex flex-col gap-s104">
         <div className="lg:pl-s160">
           <OnlineSection data={onlineData} />
         </div>
          <OnsiteSection data={onsiteData} />
        </div>
      </div>
    </section>
  );
}