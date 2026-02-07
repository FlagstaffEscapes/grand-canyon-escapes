import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bed, Bath, Users, MapPin, Check, ChevronLeft, 
  Wifi, Flame, Mountain, Utensils, Tv, Car, Sparkles,
  Wine, Dumbbell, Waves, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { usePropertyBySlug } from '@/hooks/useProperties';
import { Skeleton } from '@/components/ui/skeleton';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const amenityIcons: Record<string, React.ElementType> = {
  'Hot Tub': Waves,
  'Fireplace': Flame,
  'Mountain View': Mountain,
  'Canyon View': Mountain,
  'Forest View': Mountain,
  'Kitchen': Utensils,
  'Fully Equipped Kitchen': Utensils,
  'Gourmet Kitchen': Utensils,
  'Commercial Kitchen': Utensils,
  'WiFi': Wifi,
  'Smart TV': Tv,
  'EV Charger': Car,
  'Wine Cellar': Wine,
  'Wine Room': Wine,
  'Home Gym': Dumbbell,
  'Sauna': Sparkles,
  'Pool': Waves,
  'Home Theater': Tv,
  'Game Room': Tv,
};

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading, error } = usePropertyBySlug(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-card border-b border-border pt-24 pb-4">
          <div className="container mx-auto px-4 lg:px-8">
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <section className="bg-card pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="aspect-[4/3] rounded-lg" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This property may no longer be available.
            </p>
            <Button asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const sortedImages = [...(property.property_images || [])].sort(
    (a, b) => (a.is_primary ? -1 : 1) - (b.is_primary ? -1 : 1)
  );
  
  const galleryImages = sortedImages.length > 0 
    ? sortedImages.map(img => img.image_url)
    : ['/placeholder.svg'];

  const houseRules = property.house_rules?.split('\n').filter(Boolean) || [
    `Check-in: ${property.check_in_time || '4:00 PM'}`,
    `Checkout: ${property.check_out_time || '11:00 AM'}`,
    'No smoking',
    'Pets considered on request',
    'No parties or events',
  ];

  return (
    <Layout>
      {/* Back Button */}
      <div className="bg-card border-b border-border pt-24 pb-4">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-card pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/3] rounded-lg overflow-hidden"
            >
              <img
                src={galleryImages[0]}
                alt={property.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.slice(1, 3).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="aspect-[4/3] rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${property.name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              ))}
              {galleryImages.length <= 1 && (
                <>
                  <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No additional images</span>
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No additional images</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Property Info */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{property.city}, {property.state}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-2">{property.name}</h1>
                <p className="text-xl text-accent italic">{property.tagline}</p>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex flex-wrap gap-6 py-6 border-y border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Bed className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Bath className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-semibold">{property.sleeps}</p>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <h2 className="font-serif text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                  {property.description}
                </p>
              </motion.div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                  <h2 className="font-serif text-2xl font-semibold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Check;
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-card">
                          <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* House Rules */}
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <h2 className="font-serif text-2xl font-semibold mb-4">House Rules</h2>
                <ul className="space-y-2 text-muted-foreground">
                  {houseRules.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-32 bg-card rounded-xl p-8 shadow-xl border border-border"
              >
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="font-serif text-4xl font-semibold text-primary">
                    ${Number(property.price_per_night).toFixed(0)}
                    <span className="text-lg text-muted-foreground font-normal">/night</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <Button variant="accent" size="xl" className="w-full">
                    Check Availability
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/about">Contact Us</Link>
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Free cancellation up to 14 days before check-in
                </p>

                <div className="border-t border-border mt-6 pt-6">
                  <h3 className="font-semibold mb-3">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our team is here to help you plan your perfect getaway.
                  </p>
                  <a
                    href="tel:360-775-0592"
                    className="text-primary font-medium hover:underline"
                  >
                    Call 360-775-0592
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyDetail;
