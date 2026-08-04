// app/api/pandits/route.js

import { NextResponse } from "next/server";

// Mock data as fallback
const mockPandits = [
  {
    id: "1",
    name: "Pt. Rajesh Kumar Sharma",
    username: "rajesh_astro",
    profilePic: null,
    speciality: ["Vedic Astrology", "Kundli Reading", "Marriage Matching"],
    languages: ["Hindi", "English", "Sanskrit"],
    ratePerMin: 50,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Dr. Meera Joshi",
    username: "meera_tarot",
    profilePic: null,
    speciality: ["Tarot Reading", "Spiritual Healing", "Vastu Shastra"],
    languages: ["Hindi", "English", "Marathi"],
    ratePerMin: 75,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Pt. Suresh Sharma",
    username: "suresh_numerology",
    profilePic: null,
    speciality: ["Numerology", "Career Guidance", "Gemstone"],
    languages: ["Hindi", "English", "Punjabi"],
    ratePerMin: 60,
    isAvailable: true,
  },
];

export async function GET() {
  const baseUrl = "https://astro-nine-beige.vercel.app";
  
  // Try different possible endpoints
  const endpoints = [
    "/api/pandits",
    "/api/pandit",
    "/pandits",
    "/pandit",
    "/api/astrologers",
    "/api/experts",
    "/api/consultants",
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${baseUrl}${endpoint}`);
      
      const res = await fetch(`${baseUrl}${endpoint}`, {
        cache: "no-store",
        headers: {
          "Accept": "application/json",
        },
      });

      console.log(`${endpoint} - Status: ${res.status}`);

      if (res.ok) {
        const text = await res.text();
        
        // Check if response looks like JSON
        if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
          try {
            const data = JSON.parse(text);
            
            if (Array.isArray(data) && data.length > 0) {
              console.log(`✅ SUCCESS: ${endpoint} returned ${data.length} items`);
              const availablePandits = data.filter(p => p.isAvailable);
              console.log(`📞 Available pandits: ${availablePandits.length}`);
              return NextResponse.json(availablePandits);
            }
            
            if (data && typeof data === 'object') {
              console.log(`✅ SUCCESS: ${endpoint} returned data object`);
              return NextResponse.json(data);
            }
            
          } catch (parseError) {
            console.log(`❌ ${endpoint} - JSON parse failed:`, parseError.message);
          }
        } else {
          console.log(`❌ ${endpoint} - Response is HTML, not JSON`);
        }
      } else {
        console.log(`❌ ${endpoint} - HTTP ${res.status}`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint} - Network error:`, error.message);
    }
  }

  console.log("🔄 All external endpoints failed, using mock data");
  return NextResponse.json(mockPandits);
}