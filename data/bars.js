// Marmaris Bars & Restaurants Data
const BARS_DATA = [
  {
    id: 1,
    name: "Greenhouse Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",
    rating: 4.8,
    thumbsUp: 124,
    thumbsDown: 8,
    priceRange: "££",
    description: "Famous party bar on Bar Street with great cocktails and live music.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 120 },
        { name: "Tequila Shot", price: 120 },
        { name: "Rum Shot", price: 120 },
        { name: "Whisky Shot", price: 150 },
        { name: "Gin Shot", price: 130 }
      ],
      cocktails: [
        { name: "Mojito", price: 280 },
        { name: "Sex on the Beach", price: 280 },
        { name: "Pina Colada", price: 300 },
        { name: "Long Island Iced Tea", price: 350 },
        { name: "Cosmopolitan", price: 280 },
        { name: "Aperol Spritz", price: 320 }
      ],
      beers: [
        { name: "Efes (Draught)", price: 180 },
        { name: "Efes (Bottle)", price: 150 },
        { name: "Heineken", price: 180 },
        { name: "Corona", price: 200 }
      ],
      mixers: [
        { name: "Coca Cola", price: 60 },
        { name: "Lemonade", price: 60 },
        { name: "Tonic Water", price: 60 },
        { name: "Red Bull", price: 120 },
        { name: "Orange Juice", price: 80 },
        { name: "Cranberry Juice", price: 80 }
      ],
      softDrinks: [
        { name: "Water", price: 40 },
        { name: "Coca Cola", price: 80 },
        { name: "Fanta", price: 80 },
        { name: "Sprite", price: 80 }
      ]
    }
  },
  {
    id: 2,
    name: "Crazy Daisy",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&q=80",
    rating: 4.6,
    thumbsUp: 98,
    thumbsDown: 12,
    priceRange: "££",
    description: "Iconic bar street venue known for its lively atmosphere and bucket drinks.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 110 },
        { name: "Tequila Shot", price: 110 },
        { name: "Rum Shot", price: 110 },
        { name: "Whisky Shot", price: 140 }
      ],
      cocktails: [
        { name: "Mojito", price: 260 },
        { name: "Bucket Cocktail", price: 500 },
        { name: "Long Island Iced Tea", price: 320 },
        { name: "Blue Lagoon", price: 260 }
      ],
      beers: [
        { name: "Efes (Draught)", price: 160 },
        { name: "Efes (Bottle)", price: 140 }
      ],
      mixers: [
        { name: "Coca Cola", price: 50 },
        { name: "Lemonade", price: 50 },
        { name: "Red Bull", price: 100 }
      ],
      softDrinks: [
        { name: "Water", price: 35 },
        { name: "Coca Cola", price: 70 }
      ]
    }
  },
  {
    id: 3,
    name: "Back Street Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80",
    rating: 4.5,
    thumbsUp: 87,
    thumbsDown: 10,
    priceRange: "£",
    description: "Classic British-run pub on Bar Street, great prices and friendly staff.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 100 },
        { name: "Tequila Shot", price: 100 },
        { name: "Rum Shot", price: 100 }
      ],
      cocktails: [
        { name: "Mojito", price: 240 },
        { name: "Sex on the Beach", price: 240 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 130 },
        { name: "Heineken", price: 150 }
      ],
      mixers: [
        { name: "Coca Cola", price: 50 },
        { name: "Red Bull", price: 100 }
      ],
      softDrinks: [
        { name: "Water", price: 30 },
        { name: "Coca Cola", price: 70 }
      ]
    }
  },
  {
    id: 4,
    name: "Aquarium Restaurant",
    type: "restaurant",
    location: "Marmaris Waterfront",
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&q=80",
    rating: 4.7,
    thumbsUp: 156,
    thumbsDown: 14,
    priceRange: "£££",
    description: "Stunning waterfront seafood restaurant with fresh catches daily.",
    website: "",
    menu: {
      spirits: [
        { name: "Raki", price: 150 },
        { name: "Vodka Shot", price: 160 }
      ],
      cocktails: [
        { name: "Mojito", price: 320 },
        { name: "Aperol Spritz", price: 340 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 170 },
        { name: "Heineken", price: 190 }
      ],
      mixers: [
        { name: "Coca Cola", price: 70 },
        { name: "Tonic Water", price: 70 }
      ],
      softDrinks: [
        { name: "Water", price: 50 },
        { name: "Ayran", price: 60 }
      ]
    }
  },
  {
    id: 5,
    name: "Panorama Rooftop Bar",
    type: "bar",
    location: "Marmaris Town Centre",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80",
    rating: 4.5,
    thumbsUp: 112,
    thumbsDown: 18,
    priceRange: "£££",
    description: "Stunning rooftop views over Marmaris bay with premium cocktails.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 180 },
        { name: "Gin Shot", price: 190 },
        { name: "Whisky Shot", price: 200 }
      ],
      cocktails: [
        { name: "Mojito", price: 380 },
        { name: "Cosmopolitan", price: 360 },
        { name: "Espresso Martini", price: 400 },
        { name: "Aperol Spritz", price: 380 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 200 },
        { name: "Corona", price: 240 }
      ],
      mixers: [
        { name: "Tonic Water", price: 80 },
        { name: "Coca Cola", price: 80 },
        { name: "Red Bull", price: 140 }
      ],
      softDrinks: [
        { name: "Water", price: 60 },
        { name: "Fresh OJ", price: 120 }
      ]
    }
  },
  {
    id: 6,
    name: "Number One Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
    rating: 4.3,
    thumbsUp: 76,
    thumbsDown: 15,
    priceRange: "££",
    description: "Popular spot on Bar Street with great DJ nights and themed parties.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 115 },
        { name: "Tequila Shot", price: 115 },
        { name: "Rum Shot", price: 115 }
      ],
      cocktails: [
        { name: "Mojito", price: 270 },
        { name: "Long Island Iced Tea", price: 330 }
      ],
      beers: [
        { name: "Efes (Draught)", price: 170 },
        { name: "Efes (Bottle)", price: 145 }
      ],
      mixers: [
        { name: "Coca Cola", price: 55 },
        { name: "Red Bull", price: 110 }
      ],
      softDrinks: [
        { name: "Water", price: 35 },
        { name: "Coca Cola", price: 75 }
      ]
    }
  },
  {
    id: 7,
    name: "Yesil Dalyan Restaurant",
    type: "restaurant",
    location: "Marmaris Marina",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    rating: 4.6,
    thumbsUp: 134,
    thumbsDown: 11,
    priceRange: "£££",
    description: "Traditional Turkish cuisine by the marina, perfect for a sunset dinner.",
    website: "",
    menu: {
      spirits: [
        { name: "Raki", price: 140 },
        { name: "Vodka Shot", price: 155 }
      ],
      cocktails: [
        { name: "Mojito", price: 300 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 160 }
      ],
      mixers: [
        { name: "Coca Cola", price: 65 }
      ],
      softDrinks: [
        { name: "Water", price: 45 },
        { name: "Ayran", price: 55 }
      ]
    }
  },
  {
    id: 8,
    name: "Sundown Beach Club",
    type: "bar",
    location: "Marmaris Beach",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&q=80",
    rating: 4.4,
    thumbsUp: 95,
    thumbsDown: 20,
    priceRange: "££",
    description: "Beachfront club with daytime loungers and sunset cocktail sessions.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 130 },
        { name: "Tequila Shot", price: 130 }
      ],
      cocktails: [
        { name: "Mojito", price: 290 },
        { name: "Pina Colada", price: 310 },
        { name: "Frozen Daiquiri", price: 280 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 160 },
        { name: "Heineken", price: 180 }
      ],
      mixers: [
        { name: "Coca Cola", price: 60 },
        { name: "Lemonade", price: 60 }
      ],
      softDrinks: [
        { name: "Water", price: 40 },
        { name: "Fresh OJ", price: 100 }
      ]
    }
  },
  {
    id: 9,
    name: "Ney Restaurant",
    type: "restaurant",
    location: "Marmaris Old Town",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    rating: 4.8,
    thumbsUp: 178,
    thumbsDown: 9,
    priceRange: "£££",
    description: "Upscale Turkish restaurant in the old town with live traditional music.",
    website: "",
    menu: {
      spirits: [
        { name: "Raki", price: 160 },
        { name: "Whisky Shot", price: 200 }
      ],
      cocktails: [
        { name: "Mojito", price: 340 },
        { name: "Aperol Spritz", price: 360 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 180 }
      ],
      mixers: [
        { name: "Coca Cola", price: 70 }
      ],
      softDrinks: [
        { name: "Water", price: 50 },
        { name: "Turkish Tea", price: 40 }
      ]
    }
  },
  {
    id: 10,
    name: "Havana Club Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=80",
    rating: 4.2,
    thumbsUp: 68,
    thumbsDown: 22,
    priceRange: "££",
    description: "Cuban-themed bar with amazing rum cocktails and salsa nights.",
    website: "",
    menu: {
      spirits: [
        { name: "Rum Shot", price: 120 },
        { name: "Vodka Shot", price: 120 },
        { name: "Tequila Shot", price: 120 }
      ],
      cocktails: [
        { name: "Mojito", price: 275 },
        { name: "Daiquiri", price: 265 },
        { name: "Cuba Libre", price: 260 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 150 }
      ],
      mixers: [
        { name: "Coca Cola", price: 55 },
        { name: "Lemonade", price: 55 }
      ],
      softDrinks: [
        { name: "Water", price: 35 }
      ]
    }
  },
  {
    id: 11,
    name: "Marina Cafe & Bar",
    type: "bar",
    location: "Marmaris Marina",
    image: "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=400&q=80",
    rating: 4.1,
    thumbsUp: 62,
    thumbsDown: 18,
    priceRange: "££",
    description: "Relaxed marina bar great for watching the yachts come in.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 125 }
      ],
      cocktails: [
        { name: "Mojito", price: 270 },
        { name: "G&T", price: 250 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 155 }
      ],
      mixers: [
        { name: "Tonic Water", price: 60 },
        { name: "Coca Cola", price: 60 }
      ],
      softDrinks: [
        { name: "Water", price: 40 }
      ]
    }
  },
  {
    id: 12,
    name: "Portofino Restaurant",
    type: "restaurant",
    location: "Marmaris Waterfront",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=80",
    rating: 4.4,
    thumbsUp: 101,
    thumbsDown: 17,
    priceRange: "£££",
    description: "Italian-Turkish fusion restaurant with stunning sea views.",
    website: "",
    menu: {
      spirits: [
        { name: "Vodka Shot", price: 160 },
        { name: "Gin Shot", price: 170 }
      ],
      cocktails: [
        { name: "Aperol Spritz", price: 350 },
        { name: "Negroni", price: 370 }
      ],
      beers: [
        { name: "Efes (Bottle)", price: 175 },
        { name: "Peroni", price: 200 }
      ],
      mixers: [
        { name: "Tonic Water", price: 75 },
        { name: "Coca Cola", price: 75 }
      ],
      softDrinks: [
        { name: "Water", price: 55 },
        { name: "San Pellegrino", price: 90 }
      ]
    }
  }
];

// Default base prices for new bars
const DEFAULT_PRICES = {
  spirits: [
    { name: "Vodka Shot", price: 120 },
    { name: "Tequila Shot", price: 120 },
    { name: "Rum Shot", price: 120 },
    { name: "Whisky Shot", price: 150 },
    { name: "Gin Shot", price: 130 },
    { name: "Raki", price: 130 }
  ],
  cocktails: [
    { name: "Mojito", price: 280 },
    { name: "Sex on the Beach", price: 280 },
    { name: "Pina Colada", price: 300 },
    { name: "Long Island Iced Tea", price: 350 },
    { name: "Cosmopolitan", price: 280 },
    { name: "Aperol Spritz", price: 320 },
    { name: "Daiquiri", price: 270 },
    { name: "Blue Lagoon", price: 260 }
  ],
  beers: [
    { name: "Efes (Draught)", price: 180 },
    { name: "Efes (Bottle)", price: 150 },
    { name: "Heineken", price: 180 },
    { name: "Corona", price: 200 }
  ],
  mixers: [
    { name: "Coca Cola", price: 60 },
    { name: "Lemonade", price: 60 },
    { name: "Tonic Water", price: 60 },
    { name: "Red Bull", price: 120 },
    { name: "Orange Juice", price: 80 },
    { name: "Cranberry Juice", price: 80 },
    { name: "Pineapple Juice", price: 80 }
  ],
  softDrinks: [
    { name: "Water", price: 40 },
    { name: "Coca Cola", price: 80 },
    { name: "Fanta", price: 80 },
    { name: "Sprite", price: 80 },
    { name: "Ayran", price: 60 }
  ]
};



// Additional bars sourced from TripAdvisor, Wanderlog, and travel guides
const EXTRA_BARS = [
  {
    id: 13,
    name: "Club Areena",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80",
    rating: 4.7,
    thumbsUp: 210,
    thumbsDown: 22,
    priceRange: "££",
    description: "The biggest nightclub on Bar Street. Multi-level venue with international DJs, foam parties, and VIP areas. The full Marmaris nightlife experience.",
    website: "https://clubareena.com",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 130 },{ name: "Tequila Shot", price: 130 },{ name: "Jagermeister", price: 150 },{ name: "Rum Shot", price: 130 }],
      cocktails: [{ name: "Mojito", price: 300 },{ name: "Long Island Iced Tea", price: 380 },{ name: "Bucket Cocktail", price: 550 },{ name: "Sex on the Beach", price: 300 }],
      beers: [{ name: "Efes (Draught)", price: 180 },{ name: "Efes (Bottle)", price: 160 },{ name: "Heineken", price: 200 }],
      mixers: [{ name: "Coca Cola", price: 60 },{ name: "Red Bull", price: 130 },{ name: "Lemonade", price: 60 }],
      softDrinks: [{ name: "Water", price: 50 },{ name: "Coca Cola", price: 90 }]
    }
  },
  {
    id: 14,
    name: "Joy Club Marmaris",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=400&q=80",
    rating: 4.5,
    thumbsUp: 145,
    thumbsDown: 18,
    priceRange: "££",
    description: "High-energy nightclub on Bar Street with laser shows, themed party nights, and guest DJs from around the world.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 120 },{ name: "Tequila Shot", price: 120 },{ name: "Rum Shot", price: 120 }],
      cocktails: [{ name: "Mojito", price: 280 },{ name: "Long Island Iced Tea", price: 350 },{ name: "Blue Lagoon", price: 270 }],
      beers: [{ name: "Efes (Draught)", price: 170 },{ name: "Efes (Bottle)", price: 150 }],
      mixers: [{ name: "Coca Cola", price: 55 },{ name: "Red Bull", price: 120 }],
      softDrinks: [{ name: "Water", price: 40 },{ name: "Coca Cola", price: 80 }]
    }
  },
  {
    id: 15,
    name: "Anfield Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&q=80",
    rating: 4.6,
    thumbsUp: 165,
    thumbsDown: 12,
    priceRange: "£",
    description: "TripAdvisor Travellers' Choice. Liverpool-themed sports bar showing every match on multiple screens. Friendly staff, great craic.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 100 },{ name: "Tequila Shot", price: 100 },{ name: "Whisky Shot", price: 130 }],
      cocktails: [{ name: "Mojito", price: 250 },{ name: "Long Island Iced Tea", price: 320 }],
      beers: [{ name: "Efes (Draught)", price: 150 },{ name: "Efes (Bottle)", price: 130 },{ name: "Heineken", price: 170 }],
      mixers: [{ name: "Coca Cola", price: 50 },{ name: "Red Bull", price: 100 }],
      softDrinks: [{ name: "Water", price: 30 },{ name: "Coca Cola", price: 70 }]
    }
  },
  {
    id: 16,
    name: "Black Mirror Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&q=80",
    rating: 4.7,
    thumbsUp: 132,
    thumbsDown: 8,
    priceRange: "£",
    description: "Hidden gem just off Bar Street. Owner TJ and staff are legendary for hospitality. Cosy atmosphere, great for a chat and cocktails.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 100 },{ name: "Rum Shot", price: 100 },{ name: "Gin Shot", price: 110 }],
      cocktails: [{ name: "Mojito", price: 240 },{ name: "Cosmopolitan", price: 260 },{ name: "Espresso Martini", price: 280 }],
      beers: [{ name: "Efes (Bottle)", price: 130 },{ name: "Heineken", price: 160 }],
      mixers: [{ name: "Coca Cola", price: 50 },{ name: "Tonic Water", price: 50 }],
      softDrinks: [{ name: "Water", price: 30 },{ name: "Coca Cola", price: 65 }]
    }
  },
  {
    id: 17,
    name: "Roxy's Show Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    rating: 4.8,
    thumbsUp: 189,
    thumbsDown: 10,
    priceRange: "££",
    description: "Famous free comedy drag show starring Roxy Tart. One of the most entertaining nights out in Marmaris. Book early!",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 120 },{ name: "Tequila Shot", price: 120 },{ name: "Rum Shot", price: 120 }],
      cocktails: [{ name: "Mojito", price: 280 },{ name: "Sex on the Beach", price: 280 },{ name: "Pina Colada", price: 300 }],
      beers: [{ name: "Efes (Bottle)", price: 160 },{ name: "Heineken", price: 180 }],
      mixers: [{ name: "Coca Cola", price: 60 },{ name: "Lemonade", price: 60 }],
      softDrinks: [{ name: "Water", price: 40 },{ name: "Coca Cola", price: 80 }]
    }
  },
  {
    id: 18,
    name: "Marmaris Bar Street",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1519214605650-76a613ee3245?w=400&q=80",
    rating: 4.3,
    thumbsUp: 250,
    thumbsDown: 45,
    priceRange: "££",
    description: "The iconic Bar Street itself — hundreds of bars and clubs side by side. Fire shows, dancing on bars, open until 4am every night.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 110 },{ name: "Tequila Shot", price: 110 }],
      cocktails: [{ name: "Mojito", price: 260 },{ name: "Bucket Cocktail", price: 500 }],
      beers: [{ name: "Efes (Draught)", price: 160 }],
      mixers: [{ name: "Coca Cola", price: 50 },{ name: "Red Bull", price: 110 }],
      softDrinks: [{ name: "Water", price: 35 }]
    }
  },
  {
    id: 19,
    name: "Colosseum Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=400&q=80",
    rating: 4.2,
    thumbsUp: 88,
    thumbsDown: 16,
    priceRange: "££",
    description: "Roman-themed party bar on Bar Street. Known for foam parties, fire dancers and themed nights. Always buzzing.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 115 },{ name: "Tequila Shot", price: 115 },{ name: "Rum Shot", price: 115 }],
      cocktails: [{ name: "Mojito", price: 270 },{ name: "Long Island Iced Tea", price: 340 },{ name: "Frozen Daiquiri", price: 280 }],
      beers: [{ name: "Efes (Draught)", price: 165 },{ name: "Efes (Bottle)", price: 145 }],
      mixers: [{ name: "Coca Cola", price: 55 },{ name: "Red Bull", price: 115 }],
      softDrinks: [{ name: "Water", price: 35 },{ name: "Fanta", price: 75 }]
    }
  },
  {
    id: 20,
    name: "B-52 Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=400&q=80",
    rating: 4.1,
    thumbsUp: 72,
    thumbsDown: 14,
    priceRange: "£",
    description: "Aviation-themed bar popular with Brits. Cheap shots, fun staff, and karaoke nights that get wild.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 95 },{ name: "Tequila Shot", price: 95 },{ name: "Rum Shot", price: 95 },{ name: "B-52 Shot", price: 130 }],
      cocktails: [{ name: "Mojito", price: 230 },{ name: "Sex on the Beach", price: 230 }],
      beers: [{ name: "Efes (Bottle)", price: 120 },{ name: "Heineken", price: 150 }],
      mixers: [{ name: "Coca Cola", price: 45 },{ name: "Red Bull", price: 100 }],
      softDrinks: [{ name: "Water", price: 30 },{ name: "Coca Cola", price: 65 }]
    }
  },
  {
    id: 21,
    name: "Ice Bar Marmaris",
    type: "bar",
    location: "Long Beach, Marmaris",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
    rating: 4.4,
    thumbsUp: 105,
    thumbsDown: 15,
    priceRange: "££",
    description: "Unique ice-themed bar on Long Beach. Cool interior, literally. Great cocktails and beach vibes during the day.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 130 },{ name: "Tequila Shot", price: 130 }],
      cocktails: [{ name: "Mojito", price: 300 },{ name: "Frozen Margarita", price: 320 },{ name: "Ice Breaker Special", price: 350 }],
      beers: [{ name: "Efes (Bottle)", price: 170 },{ name: "Corona", price: 220 }],
      mixers: [{ name: "Coca Cola", price: 65 },{ name: "Red Bull", price: 130 }],
      softDrinks: [{ name: "Water", price: 45 },{ name: "Fresh OJ", price: 110 }]
    }
  },
  {
    id: 22,
    name: "Mango Beach Bar",
    type: "bar",
    location: "Long Beach, Marmaris",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    rating: 4.3,
    thumbsUp: 92,
    thumbsDown: 13,
    priceRange: "££",
    description: "Relaxed beach bar on Long Beach. Sunbeds during the day, cocktails at sunset, DJ sets after dark.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 120 },{ name: "Rum Shot", price: 120 }],
      cocktails: [{ name: "Mojito", price: 280 },{ name: "Pina Colada", price: 300 },{ name: "Mango Special", price: 320 }],
      beers: [{ name: "Efes (Bottle)", price: 160 },{ name: "Corona", price: 210 }],
      mixers: [{ name: "Coca Cola", price: 60 },{ name: "Pineapple Juice", price: 80 }],
      softDrinks: [{ name: "Water", price: 40 },{ name: "Fresh OJ", price: 100 }]
    }
  },
  {
    id: 23,
    name: "Coco Jambo Bar",
    type: "bar",
    location: "Bar Street, Marmaris",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&q=80",
    rating: 4.0,
    thumbsUp: 65,
    thumbsDown: 20,
    priceRange: "£",
    description: "Fun tropical-themed bar on Bar Street. Cheap cocktails, great music, and friendly staff.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 100 },{ name: "Tequila Shot", price: 100 }],
      cocktails: [{ name: "Mojito", price: 240 },{ name: "Pina Colada", price: 260 }],
      beers: [{ name: "Efes (Bottle)", price: 130 }],
      mixers: [{ name: "Coca Cola", price: 50 },{ name: "Red Bull", price: 100 }],
      softDrinks: [{ name: "Water", price: 30 }]
    }
  },
  {
    id: 24,
    name: "The Castle Bar",
    type: "bar",
    location: "Marmaris Old Town (near Castle)",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    rating: 4.5,
    thumbsUp: 110,
    thumbsDown: 9,
    priceRange: "££",
    description: "Atmospheric bar near Marmaris Castle with stunning views over the harbour. Perfect sunset spot with craft cocktails.",
    website: "",
    menu: {
      spirits: [{ name: "Vodka Shot", price: 140 },{ name: "Gin Shot", price: 150 },{ name: "Raki", price: 130 }],
      cocktails: [{ name: "Aperol Spritz", price: 340 },{ name: "Mojito", price: 310 },{ name: "Negroni", price: 360 }],
      beers: [{ name: "Efes (Bottle)", price: 170 },{ name: "Heineken", price: 190 }],
      mixers: [{ name: "Tonic Water", price: 70 },{ name: "Coca Cola", price: 70 }],
      softDrinks: [{ name: "Water", price: 50 },{ name: "Turkish Tea", price: 40 }]
    }
  }
];

// Merge extra bars into main data
BARS_DATA.push(...EXTRA_BARS);
