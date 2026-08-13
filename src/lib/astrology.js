import moment from 'moment-timezone';

class AstrologyCalculator {
  
  // Calculate planetary positions (simplified but functional)
  static calculatePlanets(date, time, lat, lng) {
    const dateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const julianDay = this.toJulianDay(dateTime);
    
    const planets = {
      sun: this.calculateSun(julianDay),
      moon: this.calculateMoon(julianDay),
      mars: this.calculateMars(julianDay),
      mercury: this.calculateMercury(julianDay),
      jupiter: this.calculateJupiter(julianDay),
      venus: this.calculateVenus(julianDay),
      saturn: this.calculateSaturn(julianDay),
      rahu: this.calculateRahu(julianDay),
      ketu: null // Will be calculated as opposite to Rahu
    };
    
    // Ketu is 180° opposite to Rahu
    planets.ketu = (planets.rahu + 180) % 360;
    
    // Convert to sign format
    Object.keys(planets).forEach(planet => {
      const longitude = planets[planet];
      planets[planet] = {
        longitude: longitude,
        sign: this.getZodiacSign(longitude),
        signNumber: Math.floor(longitude / 30) + 1,
        degree: Math.floor(longitude % 30),
        minute: Math.floor((longitude % 1) * 60),
        symbol: this.getPlanetSymbol(planet)
      };
    });
    
    return planets;
  }
  
  // Calculate Ascendant (Lagna)
  static calculateAscendant(date, time, lat, lng) {
    const dateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const julianDay = this.toJulianDay(dateTime);
    
    // Simplified ascendant calculation
    const lst = this.getLocalSiderealTime(julianDay, lng);
    const ascendant = (lst * 15) % 360;
    
    return {
      longitude: ascendant,
      sign: this.getZodiacSign(ascendant),
      signNumber: Math.floor(ascendant / 30) + 1,
      degree: Math.floor(ascendant % 30),
      minute: Math.floor((ascendant % 1) * 60)
    };
  }
  
  // Calculate 12 houses
  static calculateHouses(ascendantLongitude, planets) {
    const houses = [];
    
    for (let i = 0; i < 12; i++) {
      const houseLongitude = (ascendantLongitude + (i * 30)) % 360;
      houses.push({
        number: i + 1,
        sign: this.getZodiacSign(houseLongitude),
        signNumber: Math.floor(houseLongitude / 30) + 1,
        planets: []
      });
    }
    
    // Place planets in houses
    Object.entries(planets).forEach(([planetName, planetData]) => {
      const planetLongitude = planetData.longitude;
      let houseNumber = Math.floor(((planetLongitude - ascendantLongitude + 360) % 360) / 30) + 1;
      
      if (houseNumber > 12) houseNumber = houseNumber - 12;
      if (houseNumber < 1) houseNumber = houseNumber + 12;
      
      const house = houses.find(h => h.number === houseNumber);
      if (house) {
        house.planets.push({
          name: planetName,
          symbol: planetData.symbol,
          degree: planetData.degree
        });
      }
    });
    
    return houses;
  }
  
  // Helper functions
  static toJulianDay(dateTime) {
    const a = Math.floor((14 - dateTime.month()) / 12);
    const y = dateTime.year() + 4800 - a;
    const m = dateTime.month() + 12 * a - 3;
    
    return dateTime.date() + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 +
           (dateTime.hour() + dateTime.minute() / 60 + dateTime.second() / 3600) / 24;
  }
  
  static getLocalSiderealTime(jd, longitude) {
    const t = (jd - 2451545.0) / 36525;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 
                 0.000387933 * t * t - t * t * t / 38710000;
    return ((gmst + longitude) % 360) / 15;
  }
  
  static calculateSun(jd) {
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateMoon(jd) {
    const n = jd - 2451545.0;
    const L = (218.316 + 13.176396 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateMars(jd) {
    const n = jd - 2451545.0;
    const L = (355.433 + 0.5240207 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateMercury(jd) {
    const n = jd - 2451545.0;
    const L = (252.251 + 4.0923344 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateJupiter(jd) {
    const n = jd - 2451545.0;
    const L = (34.351 + 0.0831294 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateVenus(jd) {
    const n = jd - 2451545.0;
    const L = (181.979 + 1.6021302 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateSaturn(jd) {
    const n = jd - 2451545.0;
    const L = (49.557 + 0.0334442 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static calculateRahu(jd) {
    const n = jd - 2451545.0;
    const L = (259.183 - 0.0529539 * n) % 360;
    return L < 0 ? L + 360 : L;
  }
  
  static getZodiacSign(longitude) {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    return signs[Math.floor((longitude % 360) / 30)];
  }
  
  static getPlanetSymbol(planet) {
    const symbols = {
      sun: '☉', moon: '☽', mars: '♂', mercury: '☿',
      jupiter: '♃', venus: '♀', saturn: '♄', 
      rahu: '☊', ketu: '☋'
    };
    return symbols[planet] || planet;
  }
}

export default AstrologyCalculator;