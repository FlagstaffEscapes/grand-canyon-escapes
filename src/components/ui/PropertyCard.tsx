import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Users, MapPin } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyImage = Database['public']['Tables']['property_images']['Row'];

interface PropertyWithImages extends Property {
  property_images?: PropertyImage[];
}

interface PropertyCardProps {
  property: PropertyWithImages;
  index?: number;
}

export const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const primaryImage = property.property_images?.find(img => img.is_primary) 
    || property.property_images?.[0];
  const imageUrl = primaryImage?.image_url || '/placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/properties/${property.slug}`}
        className="group block bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={imageUrl} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-4 left-4 bg-cream-light/95 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="font-semibold text-charcoal">${Number(property.price_per_night).toFixed(0)}<span className="text-sm font-normal text-charcoal/70">/night</span></p>
          </div>
          {property.is_featured && (
            <div className="absolute top-4 right-4 bg-dusty-gold text-charcoal px-3 py-1 rounded-full text-xs font-semibold">Featured</div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{property.city}, {property.state}</span>
          </div>
          <h3 className="font-serif text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{property.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{property.tagline}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /><span>{property.bedrooms} BR</span></div>
            <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /><span>{property.bathrooms} BA</span></div>
            <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /><span>{property.sleeps} Guests</span></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
