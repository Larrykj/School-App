// Kenyan names database for realistic seed data

export const kenyanFirstNames = {
  male: [
    'Kamau', 'Omondi', 'Kipchoge', 'Otieno', 'Mwangi', 'Kariuki', 'Kimani', 'Njoroge',
    'Wekesa', 'Mutua', 'Kiprop', 'Kiprotich', 'Chelimo', 'Korir', 'Rotich', 'Juma',
    'Odhiambo', 'Onyango', 'Okoth', 'Owino', 'Abuya', 'Wanjala', 'Barasa', 'Simiyu',
    'Makori', 'Nyabuto', 'Ondieki', 'Bosire', 'Kibet', 'Kiptoo', 'Lagat', 'Sang',
    'Mohammed', 'Hassan', 'Ali', 'Omar', 'Abdullahi', 'Ibrahim', 'Yusuf', 'Abdi',
    'Maina', 'Mugo', 'Gitonga', 'Karanja', 'Njenga', 'Macharia', 'Mbugua', 'Muthoni',
    'Musyoka', 'Kyalo', 'Muema', 'Kituku', 'Ndungu', 'Njuguna', 'Githiomi', 'Kuria',
    'Ouma', 'Odongo', 'Oloo', 'Awiti', 'Kiptanui', 'Rono', 'Bett', 'Tuitoek',
    'Kiplimo', 'Kiprono', 'Kiplagat', 'Kosgei', 'David', 'John', 'Peter', 'Paul',
    'James', 'Daniel', 'Michael', 'Joseph', 'Samuel', 'Brian', 'Kevin', 'Eric',
    'Dennis', 'Felix', 'Victor', 'Collins', 'Evans', 'Ian', 'Allan', 'Martin',
  ],
  female: [
    'Wanjiku', 'Achieng', 'Cheptoo', 'Wanjiru', 'Nyambura', 'Wangari', 'Njoki', 'Wambui',
    'Nafula', 'Mueni', 'Jelagat', 'Chebet', 'Chepkoech', 'Cherono', 'Jepchirchir', 'Fatuma',
    'Adhiambo', 'Awino', 'Akoth', 'Akinyi', 'Anyango', 'Nekesa', 'Nasike', 'Naliaka',
    'Kemunto', 'Moraa', 'Kerubo', 'Kwamboka', 'Chepkemei', 'Chepkorir', 'Chepngetich', 'Jemutai',
    'Amina', 'Halima', 'Zainab', 'Khadija', 'Mariam', 'Safia', 'Rahma', 'Maryam',
    'Wangui', 'Wairimu', 'Wambui', 'Njeri', 'Wamuyu', 'Waithera', 'Wacera', 'Muthoni',
    'Katunge', 'Nduku', 'Mumbua', 'Kavata', 'Wanjiru', 'Wairimu', 'Njambi', 'Wangui',
    'Atieno', 'Apiyo', 'Auma', 'Onyango', 'Chepkorir', 'Chepkoech', 'Kiplagat', 'Jepkosgei',
    'Cherono', 'Jepkemei', 'Kipkemboi', 'Jeptoo', 'Mary', 'Jane', 'Lucy', 'Grace',
    'Faith', 'Joy', 'Hope', 'Mercy', 'Sarah', 'Ann', 'Christine', 'Elizabeth',
    'Margaret', 'Catherine', 'Joan', 'Joyce', 'Rose', 'Esther', 'Ruth', 'Rachel',
  ],
};

export const kenyanLastNames = [
  'Kamau', 'Kariuki', 'Mwangi', 'Njoroge', 'Kimani', 'Wanjiku', 'Waithaka', 'Wainaina',
  'Omondi', 'Otieno', 'Onyango', 'Odhiambo', 'Okoth', 'Owino', 'Achieng', 'Adhiambo',
  'Kipchoge', 'Kiprotich', 'Kiprop', 'Rotich', 'Korir', 'Chelimo', 'Cheptoo', 'Chebet',
  'Wekesa', 'Wafula', 'Wanjala', 'Barasa', 'Simiyu', 'Nafula', 'Nekesa', 'Nasike',
  'Mutua', 'Musyoka', 'Kyalo', 'Muema', 'Kituku', 'Katunge', 'Nduku', 'Mumbua',
  'Makori', 'Nyabuto', 'Ondieki', 'Bosire', 'Kemunto', 'Moraa', 'Kerubo', 'Kwamboka',
  'Kibet', 'Kiptoo', 'Kiptanui', 'Lagat', 'Sang', 'Rono', 'Bett', 'Kiplimo',
  'Mohammed', 'Hassan', 'Ali', 'Omar', 'Abdullahi', 'Ibrahim', 'Yusuf', 'Abdi',
  'Maina', 'Mugo', 'Gitonga', 'Karanja', 'Njenga', 'Macharia', 'Mbugua', 'Ndungu',
  'Ouma', 'Odongo', 'Oloo', 'Awiti', 'Otieno', 'Okello', 'Omondi', 'Ogola',
];

export const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos', 'Meru',
  'Kakamega', 'Bungoma', 'Kisii', 'Nyeri', 'Trans Nzoia', 'Kilifi', 'Narok', 'Kajiado',
  'Murang\'a', 'Embu', 'Kitui', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo',
  'Laikipia', 'Nyandarua', 'Nyamira', 'Kirinyaga', 'Tharaka Nithi', 'Makueni', 'Taita Taveta',
  'Kwale', 'Lamu', 'Tana River', 'Busia', 'Vihiga', 'Siaya', 'Migori', 'Homa Bay',
  'Turkana', 'West Pokot', 'Samburu', 'Baringo', 'Elgeyo Marakwet', 'Nandi', 'Kericho', 'Bomet',
];

export const kenyanSubCounties: Record<string, string[]> = {
  'Nairobi': [
    'Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu',
    'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central',
    'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare',
  ],
  'Mombasa': ['Mvita', 'Changamwe', 'Jomvu', 'Kisauni', 'Nyali', 'Likoni'],
  'Kisumu': ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'],
  'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Gilgil', 'Naivasha', 'Molo', 'Njoro', 'Rongai', 'Subukia'],
  'Kiambu': ['Kiambu', 'Thika Town', 'Ruiru', 'Githunguri', 'Kiambaa', 'Kabete', 'Kikuyu', 'Limuru'],
};

export function getRandomKenyanName(gender: 'male' | 'female'): { firstName: string; lastName: string } {
  const firstName = kenyanFirstNames[gender][Math.floor(Math.random() * kenyanFirstNames[gender].length)];
  const lastName = kenyanLastNames[Math.floor(Math.random() * kenyanLastNames.length)];
  return { firstName, lastName };
}

export function getRandomCounty(): string {
  return kenyanCounties[Math.floor(Math.random() * kenyanCounties.length)];
}

export function getRandomSubCounty(county: string): string {
  const subCounties = kenyanSubCounties[county] || ['Central'];
  return subCounties[Math.floor(Math.random() * subCounties.length)];
}

export function generateKenyanPhone(): string {
  const prefixes = ['710', '711', '712', '713', '714', '715', '720', '721', '722', '723', '724', '725', '726', '727', '728', '729', '740', '741', '742', '743', '745', '746', '748', '757', '758', '759', '768', '769', '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `+254 ${prefix} ${remaining.substring(0, 3)} ${remaining.substring(3)}`;
}

export function generateKenyanId(): string {
  // Kenyan ID format: 8 digits
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export function generateKUCCPSIndex(year: number): string {
  const cluster = Math.floor(11200000 + Math.random() * 100000);
  const serial = Math.floor(1 + Math.random() * 999).toString().padStart(3, '0');
  return `${cluster}${serial}/${year}`;
}

export function generateMpesaRef(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] +
                 letters[Math.floor(Math.random() * letters.length)] +
                 letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${numbers}`;
}

export function generateCheckoutRequestId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ws_CO_';
  for (let i = 0; i < 20; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
}

export function generateMerchantRequestId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
    if ([7, 11, 15, 19].includes(i)) result += '-';
  }
  return result;
}

export function generateVehicleReg(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const letter3 = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(100 + Math.random() * 900);
  return `K${letter1}${letter2} ${numbers}${letter3}`;
}

