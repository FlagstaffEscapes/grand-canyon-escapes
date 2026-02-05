import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { properties } from '@/data/properties';
import heroImage from '@/assets/hero-home.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [guestFilter, setGuestFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBedrooms = !bedroomFilter || property.bedrooms >= bedroomFilter;
    const matchesGuests = !guestFilter || property.guests >= guestFilter;
    return matchesSearch && matchesBedrooms && matchesGuests;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setBedroomFilter(null);
    setGuestFilter(null);
  };

  const hasActiveFilters = searchTerm || bedroomFilter || guestFilter;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury properties in Flagstaff"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <p className="text-cream-light/90 uppercase tracking-[0.3em] text-sm font-medium mb-4">
              Luxury Vacation Rentals
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-cream-light text-shadow-lg mb-6">
              Our Properties
            </h1>
            <p className="text-cream/90 text-lg">
              Browse our collection of handpicked luxury homes in Flagstaff, Arizona
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="text-accent">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Button
                        key={num}
                        variant={bedroomFilter === num ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBedroomFilter(bedroomFilter === num ? null : num)}
                      >
                        {num}+
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Guests</label>
                  <div className="flex flex-wrap gap-2">
                    {[2, 4, 6, 8, 10].map((num) => (
                      <Button
                        key={num}
                        variant={guestFilter === num ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGuestFilter(guestFilter === num ? null : num)}
                      >
                        {num}+
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredProperties.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8">
                Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="font-serif text-2xl mb-4">No properties found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
