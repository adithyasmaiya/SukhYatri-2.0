export interface SeedDestination {
  name: string;
  slug: string;
  state: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit: string;
  recommendedDuration: string;
  travelHighlights: string[];
  experiences: Array<{ title: string; description: string; image?: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export interface SeedTrip {
  title: string;
  slug: string;
  destinationName: string;
  state: string;
  description: string;
  shortDescription: string;
  images: string[];
  duration: string;
  days: number;
  nights: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  travelStyle: string[];
  themes: string[];
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    location: string;
    image: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  accommodation: {
    tier: string;
    hotelName?: string;
    highlights: string[];
  };
  faqs: Array<{ question: string; answer: string }>;
}

export const SEED_DESTINATIONS: SeedDestination[] = [
  {
    name: 'Goa',
    slug: 'goa',
    state: 'Goa',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    ],
    shortDescription: 'Portuguese heritage estates, quiet dolphin-hour catamaran sails, and secret golden coves.',
    description: 'Beyond the crowded beach parties lies the true charm of Goa — shaded Latin quarters with azulejo tiles, restored 120-year-old Portuguese villas, mangrove kayaking at dawn, and secret coves where the Arabian Sea laps gently against golden sands.',
    bestTimeToVisit: 'Nov – Feb (Pleasant & Breezy)',
    recommendedDuration: '4–6 days',
    travelHighlights: ['Dolphin Catamaran Sailing', 'Latin Quarter Heritage Walks', 'Private Beachfront Dinners'],
    experiences: [
      {
        title: 'Fontainhas Heritage Walk with an Architect',
        description: 'Stroll cobblestone alleys with an architectural conservator.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop',
      },
    ],
    faqs: [
      {
        question: 'When is the best time to visit Goa for a peaceful vacation?',
        answer: 'Mid-November through February offers crisp mornings and gentle breezes.',
      },
    ],
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    state: 'Kerala',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
    ],
    shortDescription: 'Private kettuvallam houseboats, misty Munnar tea hills, and authentic Ayurvedic therapies.',
    description: 'Drift across serene Vembanad waters aboard a private traditional AC kettuvallam. Wake up to misty Munnar tea hills, savor authentic sadhya meals cooked onboard by private chefs, and unwind with traditional 60-minute Ayurvedic Abhyanga massages.',
    bestTimeToVisit: 'Sep – Mar (Misty hills & gentle backwaters)',
    recommendedDuration: '5–8 days',
    travelHighlights: ['Private Houseboat Cruise', 'Tea Plantation Walks', 'Ayurvedic Wellness'],
    experiences: [
      {
        title: 'Dawn Canoe Sail in Alleppey Backwaters',
        description: 'Paddle along narrow canals inaccessible to larger houseboats.',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=800&auto=format&fit=crop',
      },
    ],
    faqs: [
      {
        question: 'Are houseboats private?',
        answer: 'Yes, SukhYatri only books 100% private, verified kettuvallams with private chefs.',
      },
    ],
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    state: 'Rajasthan',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop',
    ],
    shortDescription: 'Regal palaces, Thar desert dunes, and royal hospitality.',
    description: 'Immerse yourself in Rajasthan royal history across Jaipur, Jodhpur, and Udaipur with heritage stays, palace high-teas, and desert glamping.',
    bestTimeToVisit: 'Oct – Mar',
    recommendedDuration: '6–8 days',
    travelHighlights: ['Palace Stays', 'Dune Dinners under the Stars', 'Amber Fort Private Guide'],
    experiences: [
      {
        title: 'Private Lake Pichola Sunset Boat Cruise',
        description: 'Glide past Lake Palace and Jag Mandir with royal refreshments.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
      },
    ],
    faqs: [
      {
        question: 'Is transportation included between cities?',
        answer: 'Yes, a private air-conditioned vehicle with dedicated verified chauffeur is provided.',
      },
    ],
  },
  {
    name: 'Coorg',
    slug: 'coorg',
    state: 'Karnataka',
    heroImage: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1200&auto=format&fit=crop'],
    shortDescription: 'Aromatic coffee plantations, misty waterfalls, and Kodava hospitality.',
    description: 'Experience Scotland of India with private estate bungalows, coffee tasting sessions, and serene river trails.',
    bestTimeToVisit: 'Oct – May',
    recommendedDuration: '3–5 days',
    travelHighlights: ['Plantation Walks', 'Abbey Falls Tour', 'Coffee Cupping'],
    experiences: [
      {
        title: 'Single-Estate Coffee Cupping Masterclass',
        description: 'Learn bean roasting and sensory tasting with a third-generation planter.',
      },
    ],
    faqs: [
      {
        question: 'Which airport is closest to Coorg?',
        answer: 'Kannur (CNN) or Mangalore (IXE), followed by a 2.5-hour scenic chauffeured drive.',
      },
    ],
  },
  {
    name: 'Kashmir',
    slug: 'kashmir',
    state: 'Jammu & Kashmir',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop'],
    shortDescription: 'Shikara rides on Dal Lake, Gulmarg meadows, and saffron valleys.',
    description: 'Paradise on Earth with cedar-wood heritage houseboats, Gondola rides in Gulmarg, and slow walks in Pahalgam valleys.',
    bestTimeToVisit: 'Apr – Oct (Green valleys) or Dec – Feb (Snow)',
    recommendedDuration: '5–7 days',
    travelHighlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Betaab Valley'],
    experiences: [
      {
        title: 'Sunrise Shikara Floating Market Tour',
        description: 'Witness the centuries-old vegetable market in Dal Lake at daybreak.',
      },
    ],
    faqs: [
      {
        question: 'Is Kashmir safe for families?',
        answer: 'Yes, SukhYatri assigns verified local drivers and pre-vetted boutique heritage hotels.',
      },
    ],
  },
  {
    name: 'Andaman',
    slug: 'andaman',
    state: 'Andaman & Nicobar Islands',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop'],
    shortDescription: 'Turquoise lagoons, Radhanagar white sands, and vibrant coral reefs.',
    description: 'Escape to India premier tropical archipelago with private beach villa stays and chartered catamaran cruises.',
    bestTimeToVisit: 'Oct – May',
    recommendedDuration: '5–7 days',
    travelHighlights: ['Radhanagar Beach', 'Scuba Diving', 'Elephant Beach Kayaking'],
    experiences: [
      {
        title: 'Bioluminescent Kayaking in Havelock',
        description: 'Night paddle in glowing waters surrounded by mangrove forests.',
      },
    ],
    faqs: [
      {
        question: 'Are inter-island ferry tickets pre-booked?',
        answer: 'Yes, premium catamaran ferry tickets (Makruzz or Nautika) are included.',
      },
    ],
  },
];

export const SEED_TRIPS: SeedTrip[] = [
  {
    title: 'Kerala Slow Backwaters & Tea Trails',
    slug: 'kerala-slow-backwaters-tea-trails',
    destinationName: 'Kerala',
    state: 'Kerala',
    days: 7,
    nights: 6,
    duration: '7 Days / 6 Nights',
    price: 48500,
    originalPrice: 56900,
    discount: 15,
    rating: 4.9,
    reviewCount: 842,
    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
    ],
    travelStyle: ['Relaxation', 'Slow Travel', 'Romantic'],
    themes: ['Slow & Relaxed', 'Honeymoon', 'Family'],
    shortDescription: 'Houseboat, colonial tea estates, Fort Kochi art cafés and Ayurvedic rejuvenations.',
    description: 'Drift across serene Vembanad waters aboard a private traditional AC kettuvallam. Wake up to misty Munnar tea hills, savor authentic sadhya meals cooked onboard by private chefs, and unwind with traditional 60-minute Ayurvedic Abhyanga massages.',
    highlights: [
      '2 Nights private premium AC houseboat with onboard chef & sundeck',
      '2 Nights Munnar tea-estate bungalow with guided sunrise plantation walk',
      '1 Night Fort Kochi boutique heritage hotel near Chinese Fishing Nets',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Fort Kochi & Colonial Art Walk',
        description: 'Private chauffeur pickup from Kochi Airport (COK). Check into your boutique heritage property.',
        activities: ['Airport transfer', 'Sunset stroll by Chinese fishing nets', 'Kathakali cultural performance'],
        location: 'Fort Kochi',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 2,
        title: 'Scenic Western Ghats Ascent to Munnar',
        description: 'Ascend through cascading Cheeyappara and Valara waterfalls into the misty cardamom hills.',
        activities: ['Scenic mountain drive', 'Cheeyappara waterfall photo-stop', 'Check-in to tea estate bungalow'],
        location: 'Munnar',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 3,
        title: 'Sunrise Plantation Walk & Tea Factory Tasting',
        description: 'Walk through dewy tea gardens followed by a private tea tasting session.',
        activities: ['Guided plantation walk', 'Tea museum tour & tasting', 'Mattupetty dam panoramic viewpoint'],
        location: 'Munnar',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 4,
        title: 'Journey to the Backwaters of Alleppey',
        description: 'Descend to Alleppey and board your private air-conditioned kettuvallam.',
        activities: ['Board private houseboat', 'Fresh Karimeen fry lunch prepared onboard', 'Sunset cruise across Vembanad'],
        location: 'Alleppey',
        image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 5,
        title: 'Quiet Canals & Village Life',
        description: 'Glide into narrow palm-fringed village canals inaccessible to commercial boats.',
        activities: ['Morning village walk', 'Toddy tapper demonstration', 'Traditional candlelit dinner on water'],
        location: 'Kumarakom',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 6,
        title: 'Marari Beach Relaxation & Rejuvenation',
        description: 'Disembark and transfer to a quiet eco-retreat on Marari beach for restorative Ayurvedic massage.',
        activities: ['Ayurvedic consultation & massage', 'Barefoot beach sunset stroll'],
        location: 'Marari',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
      },
      {
        day: 7,
        title: 'Farewell Kerala & Airport Transfer',
        description: 'Savor a leisurely appam and stew breakfast before comfortable chauffeur drop at Kochi Airport.',
        activities: ['Leisurely breakfast', 'Spice market shopping stop', 'Airport drop-off'],
        location: 'Kochi Airport',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: [
      '6 Nights accommodation in handpicked boutique & heritage properties',
      'Daily curated breakfasts and all meals onboard the private houseboat',
      'Private air-conditioned vehicle with dedicated verified chauffeur',
      'One 60-minute Ayurvedic Abhyanga massage per adult',
    ],
    exclusions: ['Airfare or train tickets to/from Kochi', 'Personal shopping and optional water sports'],
    accommodation: {
      tier: 'Heritage Boutique & Private Houseboat',
      hotelName: 'Fragrant Nature Munnar & Private Kettuvallam',
      highlights: ['Tea plantation views', 'Private chef onboard', 'Ayurvedic spa'],
    },
    faqs: [
      {
        question: 'Is the houseboat shared with other tourists?',
        answer: 'Never. All SukhYatri houseboats are 100% private reservations for you and your travelling party.',
      },
    ],
  },
  {
    title: 'Royal Rajasthan — Palaces & Desert Stars',
    slug: 'royal-rajasthan-palaces-desert-stars',
    destinationName: 'Rajasthan',
    state: 'Rajasthan',
    days: 7,
    nights: 6,
    duration: '7 Days / 6 Nights',
    price: 56400,
    originalPrice: 65000,
    discount: 13,
    rating: 4.9,
    reviewCount: 612,
    images: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Heritage', 'Luxury', 'Cultural'],
    themes: ['Heritage & Forts', 'Romantic', 'Photography'],
    shortDescription: 'Pink City havelis, Blue City ramparts, and luxury Swiss desert tents under star-studded Thar skies.',
    description: 'Relive the grandeur of Rajput royalty across Jaipur, Jodhpur, and the golden dunes of Osian with heritage palace stays and private candlelit dinners.',
    highlights: ['Amber Fort guided sunrise exploration', 'Thar desert luxury glamping with folk music & stargazing'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jaipur & Johari Bazaar Walk',
        description: 'Chauffeur pickup from Jaipur Airport (JAI). Check in to your heritage haveli.',
        activities: ['Airport pickup', 'Evening heritage stroll'],
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['Heritage hotel accommodations', 'Private chauffeur vehicle for entire tour', 'Daily breakfast'],
    exclusions: ['Flight fares', 'Monument camera fees'],
    accommodation: {
      tier: 'Royal Heritage Palaces',
      highlights: ['Courtyard dining', 'Traditional hospitality'],
    },
    faqs: [{ question: 'Are desert tents air-conditioned?', answer: 'Yes, all our luxury desert tents have private en-suite bathrooms and temperature control.' }],
  },
  {
    title: 'Coorg Coffee Whispers & Misty Valleys',
    slug: 'coorg-coffee-whispers-misty-valleys',
    destinationName: 'Coorg',
    state: 'Karnataka',
    days: 4,
    nights: 3,
    duration: '4 Days / 3 Nights',
    price: 32000,
    originalPrice: 38000,
    discount: 15,
    rating: 4.8,
    reviewCount: 420,
    images: ['https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Nature', 'Slow Travel', 'Relaxation'],
    themes: ['Hills', 'Coffee Trails'],
    shortDescription: 'Wake up to the aroma of freshly roasted arabica inside a 200-acre private coffee estate.',
    description: 'Serene streams, Kodava cuisine, and lush mountain trails in Karnataka green jewel.',
    highlights: ['Private coffee estate bungalow stay', 'Abbey Falls guided hike', 'Kodava culinary masterclass'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Coorg & Plantation Check-in',
        description: 'Chauffeur pickup from Mangalore or Kannur. Check into your heritage plantation suite.',
        activities: ['Scenic drive', 'Estate walk'],
        location: 'Madikeri',
        image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['3 Nights estate suite', 'Daily breakfast and plantation walk', 'Private vehicle'],
    exclusions: ['Personal expenses'],
    accommodation: {
      tier: 'Private Estate Suite',
      highlights: ['Coffee plantation views', 'Organic dining'],
    },
    faqs: [{ question: 'Is vegetarian food available?', answer: 'Yes, fresh Kodava vegetarian dishes are freshly prepared daily.' }],
  },
  {
    title: 'Kashmir Valley of Whispering Pines',
    slug: 'kashmir-valley-whispering-pines',
    destinationName: 'Kashmir',
    state: 'Jammu & Kashmir',
    days: 6,
    nights: 5,
    duration: '6 Days / 5 Nights',
    price: 52000,
    originalPrice: 62000,
    discount: 16,
    rating: 4.9,
    reviewCount: 710,
    images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Romantic', 'Nature', 'Heritage'],
    themes: ['Snow & Mountains', 'Honeymoon'],
    shortDescription: 'Dal Lake cedarwood houseboats, Gulmarg meadows, and Betaab valley pines.',
    description: 'Experience heaven on earth with private shikara cruises, saffron farm visits, and snow views.',
    highlights: ['Cedarwood houseboat on Nigeen Lake', 'Gulmarg Gondola Phase 1 & 2', 'Pahalgam riverside picnic'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Sunset Shikara',
        description: 'Chauffeur pickup from Srinagar Airport. Board your private luxury houseboat.',
        activities: ['Airport transfer', 'Sunset shikara ride'],
        location: 'Srinagar',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['5 Nights accommodation', 'Private shikara ride', 'All ground transfers with private driver'],
    exclusions: ['Gondola tickets', 'Horse riding at pony tracks'],
    accommodation: {
      tier: 'Luxury Cedar Houseboat & Boutique Resorts',
      highlights: ['Carved walnut wood', 'Lake views'],
    },
    faqs: [{ question: 'Are houseboats heated in cold months?', answer: 'Yes, all our verified houseboats feature electric heaters and traditional bukhari warming.' }],
  },
  {
    title: 'Goa Heritage & Secret Beach Escape',
    slug: 'goa-heritage-secret-beach-escape',
    destinationName: 'Goa',
    state: 'Goa',
    days: 5,
    nights: 4,
    duration: '5 Days / 4 Nights',
    price: 36000,
    originalPrice: 42000,
    discount: 14,
    rating: 4.8,
    reviewCount: 530,
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Relaxation', 'Heritage', 'Beach'],
    themes: ['Beach & Coast', 'Slow & Relaxed'],
    shortDescription: 'Restored Portuguese villa in Assagao, private catamaran sailing, and uncrowded southern coves.',
    description: 'Unwind in north Goa tranquil villages and south Goa secluded sands far away from crowded tourist hotspots.',
    highlights: ['Private villa stay with lap pool', 'Sunset catamaran cruise with wine', 'Fontainhas heritage architecture walk'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa & Villa Check-in',
        description: 'Private chauffeur pickup from Mopa or Dabolim airport. Check into your heritage villa.',
        activities: ['Airport transfer', 'Villa pool relaxation'],
        location: 'Assagao',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['4 Nights boutique villa accommodation', 'Daily artisanal breakfast', 'Private vehicle for all 5 days'],
    exclusions: ['Airfare', 'Alcoholic beverages beyond welcome tasting'],
    accommodation: {
      tier: 'Restored Portuguese Villa',
      highlights: ['Private pool', 'High ceilings & antique furniture'],
    },
    faqs: [{ question: 'Is a self-drive car available?', answer: 'We provide chauffeur-driven vehicles by default for complete passenger comfort and local navigation.' }],
  },
  {
    title: 'Andaman Turquoise Lagoons & White Sands',
    slug: 'andaman-turquoise-lagoons-white-sands',
    destinationName: 'Andaman',
    state: 'Andaman & Nicobar Islands',
    days: 6,
    nights: 5,
    duration: '6 Days / 5 Nights',
    price: 68000,
    originalPrice: 78000,
    discount: 12,
    rating: 4.9,
    reviewCount: 390,
    images: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Romantic', 'Adventure', 'Beach'],
    themes: ['Island', 'Scuba & Marine'],
    shortDescription: 'Radhanagar sunsets, chartered catamaran to Neil Island, and private beach villa living.',
    description: 'India premier island sanctuary with crystal-clear waters, bioluminescent night kayaking, and pristine coral reefs.',
    highlights: ['Beachfront cottage on Havelock Island', 'Private guided scuba discovery dive', 'Candlelit dinner on white sand'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Port Blair & Cellular Jail Light Show',
        description: 'Pickup from Port Blair Airport (IXZ). Evening sound and light show at the historic landmark.',
        activities: ['Airport transfer', 'Historic heritage visit'],
        location: 'Port Blair',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['5 Nights beachfront resort accommodation', 'Premium private catamaran ferry tickets', 'Daily breakfast'],
    exclusions: ['Flights to Port Blair', 'Personal scuba certifications'],
    accommodation: {
      tier: 'Beachfront Resort Villa',
      highlights: ['Private access to beach', 'Ocean-view dining'],
    },
    faqs: [{ question: 'Are ferry tickets confirmed in advance?', answer: 'Yes, Makruzz or Nautika catamaran seats are confirmed upon booking.' }],
  },
  {
    title: 'Manali Alpine Retreat & Solang Valleys',
    slug: 'manali-alpine-retreat-solang-valleys',
    destinationName: 'Manali',
    state: 'Himachal Pradesh',
    days: 5,
    nights: 4,
    duration: '5 Days / 4 Nights',
    price: 28500,
    originalPrice: 34000,
    discount: 16,
    rating: 4.8,
    reviewCount: 480,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Adventure', 'Nature', 'Hills'],
    themes: ['Mountains', 'Valley Treks'],
    shortDescription: 'Apple orchards, cedar-scented air, and panoramic Himalayan vistas from Old Manali cottages.',
    description: 'Discover serene cedar trails, traditional wooden temples, and peaceful riverside cafes in Himachal.',
    highlights: ['Apple orchard boutique cottage stay', 'Jogini waterfalls guided trek', 'Solang valley mountain excursion'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Manali & Orchard Cottage Check-in',
        description: 'Chauffeur pickup from Kullu Airport or Chandigarh. Check in to your cottage facing the snow peaks.',
        activities: ['Scenic transfer', 'Old Manali walk'],
        location: 'Manali',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['4 Nights cottage accommodation', 'Daily breakfast and dinner', 'Private vehicle throughout'],
    exclusions: ['Adventure activities fees like paragliding'],
    accommodation: {
      tier: 'Alpine Orchard Cottage',
      highlights: ['Mountain views', 'Fireplace lounge'],
    },
    faqs: [{ question: 'Is heating provided in rooms?', answer: 'Yes, all rooms include room heaters and electric blankets during cool months.' }],
  },
  {
    title: 'Jaipur & Udaipur — City of Lakes Splendor',
    slug: 'jaipur-udaipur-city-of-lakes-splendor',
    destinationName: 'Rajasthan',
    state: 'Rajasthan',
    days: 6,
    nights: 5,
    duration: '6 Days / 5 Nights',
    price: 49500,
    originalPrice: 58000,
    discount: 14,
    rating: 4.9,
    reviewCount: 395,
    images: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Romantic', 'Heritage', 'Luxury'],
    themes: ['Lakes & Palaces', 'Honeymoon'],
    shortDescription: 'Lake Pichola sunset boat sails, City Palace courtyards, and Jaipur haveli grandeur.',
    description: 'A matchless royal circuit curated for travellers who appreciate artistic heritage and romantic sunsets.',
    highlights: ['Private sunset boat ride on Lake Pichola', 'Udaipur City Palace private curator tour', 'Hawa Mahal sunrise photo walk'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in the Pink City',
        description: 'Welcome by your private chauffeur in Jaipur. Evening at leisure in your heritage haveli.',
        activities: ['Airport pickup', 'Welcome refreshments'],
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['5 Nights boutique heritage palace stays', 'All transfers by private vehicle', 'Daily breakfast'],
    exclusions: ['Airfare', 'Personal purchases'],
    accommodation: {
      tier: 'Heritage Boutique Palace',
      highlights: ['Lake view terrace', 'Traditional architecture'],
    },
    faqs: [{ question: 'How is the transit from Jaipur to Udaipur handled?', answer: 'Via private air-conditioned vehicle with a stop at Chittorgarh or direct flight depending on your preference.' }],
  },
  {
    title: 'Hampi Boulders & Vijayanagara Whispers',
    slug: 'hampi-boulders-vijayanagara-whispers',
    destinationName: 'Karnataka',
    state: 'Karnataka',
    days: 4,
    nights: 3,
    duration: '4 Days / 3 Nights',
    price: 29000,
    originalPrice: 35000,
    discount: 17,
    rating: 4.8,
    reviewCount: 310,
    images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Heritage', 'Cultural', 'Photography'],
    themes: ['UNESCO World Heritage', 'Ancient Architecture'],
    shortDescription: 'Stone chariot grandeur, coracle rides on the Tungabhadra, and sunset from Matanga Hill.',
    description: 'Walk through 14th-century capital of the Vijayanagara Empire among surreal granite boulder landscapes.',
    highlights: ['UNESCO monuments with senior historian guide', 'Sunset coracle ride on Tungabhadra river', 'Luxury heritage tent stay'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hampi & Tungabhadra Sunset',
        description: 'Chauffeur transfer from Jindal Vijayanagar Airport (VDY) or Hubli. Check into your heritage resort.',
        activities: ['Transfer', 'Sunset view'],
        location: 'Hampi',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['3 Nights heritage resort accommodation', 'Daily breakfast', 'Archaeologist-certified private guide'],
    exclusions: ['Travel to Hubli/Toranagallu'],
    accommodation: {
      tier: 'Heritage Resort',
      highlights: ['Stone architecture', 'Ayurvedic center'],
    },
    faqs: [{ question: 'Is walking extensive in Hampi?', answer: 'Yes, but our private vehicle drives as close as permitted to all royal monuments.' }],
  },
  {
    title: 'Varanasi Spiritual Dawns & Silk Looms',
    slug: 'varanasi-spiritual-dawns-silk-looms',
    destinationName: 'Varanasi',
    state: 'Uttar Pradesh',
    days: 4,
    nights: 3,
    duration: '4 Days / 3 Nights',
    price: 24500,
    originalPrice: 30000,
    discount: 18,
    rating: 4.9,
    reviewCount: 520,
    images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Spiritual', 'Cultural', 'Photography'],
    themes: ['Ancient City', 'Ganga Ghats'],
    shortDescription: 'Private wooden boat at dawn on the sacred Ganga, evening Dashashwamedh Aarti from the river, and Banarasi silk weaver studios.',
    description: 'Experience one of the world oldest living cities with quiet dawn river reflections, classical morning raag music, and hidden culinary alleys.',
    highlights: ['Exclusive wooden bajra boat for dawn Aarti', 'Behind-the-scenes master silk loom workshop in Mubarakpur', 'Sarnath deer park private excursion'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kashi & Evening Ganga Aarti',
        description: 'Chauffeur pickup from Varanasi Airport (VNS). Private boat viewing of the evening grand Aarti.',
        activities: ['Airport pickup', 'Evening river ceremony'],
        location: 'Varanasi',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['3 Nights riverside heritage hotel stay', 'Two private boat rides on the Ganga', 'Daily breakfast'],
    exclusions: ['Flight fares to Varanasi'],
    accommodation: {
      tier: 'Ghat Heritage Haveli',
      highlights: ['Direct river views', 'Rooftop morning yoga'],
    },
    faqs: [{ question: 'Is the boat ride private?', answer: 'Yes, you will have your own private boat with life jackets and a respectful local boatman.' }],
  },
  {
    title: 'Munnar & Thekkady Spice Trail Journey',
    slug: 'munnar-thekkady-spice-trail-journey',
    destinationName: 'Kerala',
    state: 'Kerala',
    days: 5,
    nights: 4,
    duration: '5 Days / 4 Nights',
    price: 34500,
    originalPrice: 40000,
    discount: 13,
    rating: 4.8,
    reviewCount: 340,
    images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Nature', 'Slow Travel'],
    themes: ['Spice & Tea', 'Wildlife'],
    shortDescription: 'Cardamom forests, Periyar lake boat safari, and misty tea hill mornings.',
    description: 'Immerse your senses in green hills, aromatic spice gardens, and wild elephant sightings in the Periyar sanctuary.',
    highlights: ['Organic spice plantation walk with botanist', 'Periyar lake morning boat cruise', 'Tea factory tasting'],
    itinerary: [
      {
        day: 1,
        title: 'Kochi to Munnar Mountain Drive',
        description: 'Pickup from Kochi and drive up through waterfalls to Munnar.',
        activities: ['Scenic transfer', 'Tea garden stroll'],
        location: 'Munnar',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['4 Nights boutique resort accommodation', 'Breakfast & dinner', 'Private car and driver'],
    exclusions: ['Personal purchases'],
    accommodation: {
      tier: 'Boutique Plantation Resort',
      highlights: ['Forest views', 'Spice garden on premises'],
    },
    faqs: [{ question: 'Are wildlife sightings guaranteed in Periyar?', answer: 'While wild animals roam freely, morning boat rides regularly spot wild elephants, bison, and otters along the lake edge.' }],
  },
  {
    title: 'Rishikesh & Garhwal Himalayan Stillness',
    slug: 'rishikesh-garhwal-himalayan-stillness',
    destinationName: 'Uttarakhand',
    state: 'Uttarakhand',
    days: 5,
    nights: 4,
    duration: '5 Days / 4 Nights',
    price: 38000,
    originalPrice: 44000,
    discount: 13,
    rating: 4.9,
    reviewCount: 290,
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop'],
    travelStyle: ['Wellness', 'Spiritual', 'Nature'],
    themes: ['Yoga & Meditation', 'Himalayas'],
    shortDescription: 'Ganges soundscapes, morning pranayama by the river, and mindful Ayurvedic meals.',
    description: 'Find inner balance in the yoga capital of the world with luxurious riverside retreat living, guided sound healing, and tranquil pine walks.',
    highlights: ['Riverside luxury wellness retreat stay', 'Daily sunrise yoga & sound bath sessions', 'Private evening Aarti at Parmarth Niketan'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dehradun & Transfer to Rishikesh',
        description: 'Chauffeur pickup from Dehradun Airport (DED). Check into your riverside sanctuary.',
        activities: ['Airport transfer', 'Evening meditation'],
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
      },
    ],
    inclusions: ['4 Nights riverside retreat accommodation', 'Organic sattvic breakfast & dinner', 'Private transfers'],
    exclusions: ['River rafting fees'],
    accommodation: {
      tier: 'Luxury Wellness Sanctuary',
      highlights: ['Direct Ganga riverbank access', 'Ayurvedic spa'],
    },
    faqs: [{ question: 'Is the retreat suitable for beginners in yoga?', answer: 'Yes, sessions are personalized to match all flexibility and comfort levels.' }],
  },
];
