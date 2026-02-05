export interface Property {
  id: string;
  name: string;
  tagline: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  pricePerNight: number;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
}

export const properties: Property[] = [
  {
    id: 'ponderosa-retreat',
    name: 'Ponderosa Retreat',
    tagline: 'A luxurious cabin nestled in the pines',
    location: 'Flagstaff, AZ',
    bedrooms: 4,
    bathrooms: 3,
    guests: 10,
    pricePerNight: 450,
    images: ['/placeholder.svg'],
    description: 'Experience the ultimate mountain getaway at Ponderosa Retreat. This stunning 4-bedroom cabin offers breathtaking views of the San Francisco Peaks, a gourmet kitchen, and a private hot tub under the stars. Just 15 minutes from downtown Flagstaff and an hour from the Grand Canyon.',
    amenities: ['Hot Tub', 'Fireplace', 'Mountain View', 'Fully Equipped Kitchen', 'WiFi', 'Smart TV', 'Heated Floors', 'Game Room', 'Outdoor Fire Pit', 'BBQ Grill'],
    featured: true,
  },
  {
    id: 'alpine-lodge',
    name: 'Alpine Lodge',
    tagline: 'Modern luxury meets mountain charm',
    location: 'Flagstaff, AZ',
    bedrooms: 5,
    bathrooms: 4,
    guests: 12,
    pricePerNight: 650,
    images: ['/placeholder.svg'],
    description: 'Alpine Lodge is the pinnacle of mountain luxury. This expansive 5-bedroom estate features floor-to-ceiling windows, a chef\'s kitchen, home theater, and a wraparound deck with panoramic forest views. Perfect for family gatherings or executive retreats.',
    amenities: ['Hot Tub', 'Sauna', 'Home Theater', 'Wine Cellar', 'Fireplace', 'Mountain View', 'Game Room', 'WiFi', 'EV Charger', 'Private Chef Available'],
    featured: true,
  },
  {
    id: 'canyon-vista',
    name: 'Canyon Vista',
    tagline: 'Romantic retreat with stunning views',
    location: 'Flagstaff, AZ',
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    pricePerNight: 295,
    images: ['/placeholder.svg'],
    description: 'Perfect for couples seeking a romantic escape, Canyon Vista offers intimate luxury with dramatic canyon views. Features include a private deck with hot tub, gourmet kitchen, and a cozy fireplace. The ideal base for Grand Canyon adventures.',
    amenities: ['Hot Tub', 'Fireplace', 'Canyon View', 'Gourmet Kitchen', 'WiFi', 'Smart TV', 'Heated Bathroom Floors', 'Coffee Bar'],
    featured: true,
  },
  {
    id: 'timber-haven',
    name: 'Timber Haven',
    tagline: 'Cozy elegance in the forest',
    location: 'Flagstaff, AZ',
    bedrooms: 3,
    bathrooms: 2,
    guests: 8,
    pricePerNight: 375,
    images: ['/placeholder.svg'],
    description: 'Timber Haven combines rustic charm with modern comfort. This beautifully appointed 3-bedroom home features exposed timber beams, a river rock fireplace, and a spacious deck overlooking a meadow. Ideal for families seeking a peaceful mountain retreat.',
    amenities: ['Fireplace', 'Forest View', 'Fully Equipped Kitchen', 'WiFi', 'Smart TV', 'Outdoor Fire Pit', 'BBQ Grill', 'Board Games', 'Books Library'],
    featured: false,
  },
  {
    id: 'stargazer-cabin',
    name: 'Stargazer Cabin',
    tagline: 'Where the stars come alive',
    location: 'Flagstaff, AZ',
    bedrooms: 2,
    bathrooms: 1,
    guests: 4,
    pricePerNight: 225,
    images: ['/placeholder.svg'],
    description: 'Named for the incredible dark sky views Flagstaff is famous for, Stargazer Cabin offers a magical escape. Features include a rooftop observation deck, telescope, and cozy interiors. Perfect for astronomy enthusiasts and romantic getaways.',
    amenities: ['Telescope', 'Observation Deck', 'Fireplace', 'WiFi', 'Smart TV', 'Coffee Bar', 'Outdoor Fire Pit'],
    featured: false,
  },
  {
    id: 'mountain-majesty',
    name: 'Mountain Majesty',
    tagline: 'Grand living at 7,000 feet',
    location: 'Flagstaff, AZ',
    bedrooms: 6,
    bathrooms: 5,
    guests: 16,
    pricePerNight: 895,
    images: ['/placeholder.svg'],
    description: 'Mountain Majesty is our most exclusive property, offering unparalleled luxury for large groups. This magnificent 6-bedroom estate features a commercial kitchen, indoor pool, home gym, and breathtaking views from every room. The ultimate destination for milestone celebrations.',
    amenities: ['Indoor Pool', 'Hot Tub', 'Home Gym', 'Sauna', 'Home Theater', 'Commercial Kitchen', 'Wine Room', 'Game Room', 'Elevator', 'Concierge Service'],
    featured: true,
  },
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find((p) => p.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter((p) => p.featured);
};
