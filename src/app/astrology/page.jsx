"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Heart, Stars, ArrowRight, Sparkles, User, Clock, Target, Award, Star } from 'lucide-react';

export default function AstrologyPage() {
  const router = useRouter();

  const features = [
    {
      id: 'kundali-making',
      title: 'Kundali Making',
      description: 'Generate detailed birth chart with planetary positions and house analysis',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-primary-main to-primary-light',
      path: '/astrology/kundali-making',
      features: ['12 Houses Analysis', 'Planetary Positions', 'Nakshatra Details', 'Dasha Periods']
    },
    {
      id: 'kundali-matching',
      title: 'Kundali Matching',
      description: 'Check compatibility between two birth charts with detailed analysis',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-red-500 to-red-main',
      path: '/astrology/kundali-matching',
      features: ['36-Point Matching', 'Dosha Analysis', 'Compatibility Score', 'Recommendations']
    },
    {
      id: 'horoscope',
      title: 'Daily Horoscope',
      description: 'Get personalized daily predictions based on your zodiac sign',
      icon: <Stars className="w-8 h-8" />,
      color: 'from-primary-light to-accent-main',
      path: '/astrology/horoscope',
      features: ['Daily Updates', 'Love & Career', 'Lucky Numbers', 'Health Tips']
    }
  ];

  const stats = [
    { label: 'Kundalis Generated', value: '25,000+', icon: <Calendar className="w-6 h-6" /> },
    { label: 'Matches Made', value: '10,000+', icon: <Heart className="w-6 h-6" /> },
    { label: 'Daily Readings', value: '100K+', icon: <User className="w-6 h-6" /> },
    { label: 'Accuracy Rate', value: '95%+', icon: <Award className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      text: "The kundali matching helped us understand our compatibility. Very accurate predictions!",
      rating: 5,
      location: "Mumbai"
    },
    {
      name: "Rajesh Kumar", 
      text: "Daily horoscope is spot on. I check it every morning before starting my day.",
      rating: 5,
      location: "Delhi"
    },
    {
      name: "Anita Patel",
      text: "Free kundali making service is excellent. Detailed analysis with beautiful charts.",
      rating: 5,
      location: "Ahmedabad"
    }
  ];

  return (
    <div className="min-h-screen ">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-primary-light/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          
          <div className="text-center mt-s80">
            
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-main mb-6">
              Free Astrology
              <span className="block bg-gradient-to-r from-primary-main to-primary-light bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover your destiny with accurate Kundali making, compatibility matching, 
              and personalized daily horoscope - completely free!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => router.push('/astrology/kundali-making')}
                className="px-8 py-4 bg-gradient-to-r from-primary-main to-primary-light text-background text-lg font-semibold rounded-full hover:from-primary-light hover:to-primary-main transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Generate Free Kundali
              </button>
              <button 
                onClick={() => router.push('/astrology/horoscope')}
                className="px-8 py-4 border-2 border-primary-main text-primary-main text-lg font-semibold rounded-full hover:bg-primary-main hover:text-background transition-all duration-200"
              >
                View Daily Horoscope
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-primary-main/10 rounded-full text-primary-main">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-main">{stat.value}</div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">
            Choose Your Astrology Service
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Explore our comprehensive astrology services designed to guide your life decisions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group cursor-pointer"
              onClick={() => router.push(feature.path)}
            >
              <div className="bg-background rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-primary-main/10">
                
                {/* Header */}
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                
                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-background mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-main mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-secondary mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-light rounded-full"></div>
                        <span className="text-sm text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary">
                      Get Started Free
                    </span>
                    <ArrowRight className="w-5 h-5 text-accent-main group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-secondary-main/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary">Simple steps to unlock your cosmic insights</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-main" />
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">Enter Details</h3>
              <p className="text-secondary">Provide your birth date, time, and place for accurate calculations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-light" />
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">Analysis</h3>
              <p className="text-secondary">Our advanced algorithms analyze planetary positions and cosmic influences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent-main" />
              </div>
              <h3 className="text-xl font-semibold text-main mb-2">Get Results</h3>
              <p className="text-secondary">Receive detailed insights, predictions, and personalized guidance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-secondary">Trusted by thousands of satisfied users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background rounded-xl shadow-lg p-6 border border-primary-main/10">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-main fill-current" />
                  ))}
                </div>
                <p className="text-secondary mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-main">{testimonial.name}</div>
                  <div className="text-sm text-secondary">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-main to-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Ready to Discover Your Destiny?
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Join thousands who have unlocked their cosmic potential with our free astrology services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/astrology/kundali-making')}
              className="px-8 py-4 bg-background text-primary-main text-lg font-semibold rounded-full hover:bg-secondary-main transition-colors"
            >
              Start Your Free Kundali
            </button>
            <button 
              onClick={() => router.push('/astrology/kundali-matching')}
              className="px-8 py-4 border-2 border-background text-background text-lg font-semibold rounded-full hover:bg-background hover:text-primary-main transition-colors"
            >
              Check Compatibility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}