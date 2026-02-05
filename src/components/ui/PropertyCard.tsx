import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/data/properties';
import propertyExterior from '@/assets/property-exterior-1.jpg';
import propertyInterior from '@/assets/property-interior-1.jpg';
import propertyBedroom from '@/assets/property-bedroom.jpg';

// Use different images for variety
const propertyImages = [propertyExterior, propertyInterior, propertyBedroom];

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const imageToUse = propertyImages[index % propertyImages.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageToUse}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          From ${property.pricePerNight}/night
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {property.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{property.tagline}</p>
        </div>

        <p className="text-sm text-muted-foreground">{property.location}</p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            <span>{property.guests} Guests</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </div>
    </motion.div>
  );
};
