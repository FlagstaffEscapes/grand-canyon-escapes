import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, MapPin, TrendingUp, HandshakeIcon, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-home.jpg';
import grandCanyonImage from '@/assets/grand-canyon.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Index = () => {
  const { data: featuredProperties, isLoading } = useFeaturedProperties();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury mountain cabin at sunset in Flagstaff"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 gradient-hero-top" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-cream-light/90 uppercase tracking-[0.3em] text-sm font-medium"
            >
              Vacation Rental Management • Flagstaff, Arizona
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream-light text-shadow-lg leading-tight"
            >
              Flagstaff Escapes
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="font-serif text-2xl md:text-3xl text-dusty-gold italic"
            >
              Premier Rental Management
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              We turn luxury properties into top-performing vacation rentals. Full-service management, maximum returns.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/owners">
                  Partner With Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline-light" size="xl" asChild>
                <Link to="/properties">Browse Properties</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream-light/70"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-cream-light/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Value Proposition — Owner Focused */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: TrendingUp,
                title: 'Maximize Revenue',
                description: 'Dynamic pricing and multi-platform marketing that consistently outperforms market averages for our owners.',
              },
              {
                icon: HandshakeIcon,
                title: 'Hands-Off Management',
                description: 'Full-service operations from guest communication and bookings to cleaning, maintenance, and reporting.',
              },
              {
                icon: Compass,
                title: 'Local Expertise',
                description: 'Deep Flagstaff knowledge and a curated luxury brand that attracts premium guests and repeat bookings.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="text-center p-8 bg-card rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* For Owners CTA — Moved Higher */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center text-primary-foreground"
          >
            <motion.p variants={fadeInUp} className="uppercase tracking-[0.2em] text-sm font-medium mb-4 opacity-80">
              Property Owners
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Maximize Your Property's Potential
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-cream/80 text-lg leading-relaxed mb-8">
              Partner with Flagstaff's premier vacation rental management company. We handle everything from marketing to guest services, so you can enjoy passive income without the hassle.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/owners">
                  Learn About Management
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties — Social Proof */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Our Portfolio
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Properties We Manage
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              See the luxury properties thriving under our management — from intimate cabins to grand mountain estates.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : featuredProperties && featuredProperties.length > 0 ? (
              featuredProperties.slice(0, 3).map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No featured properties available yet.</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="default" size="lg" asChild>
              <Link to="/properties">
                View All Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Grand Canyon — Market Demand Proof */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={grandCanyonImage}
            alt="Grand Canyon at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center text-cream-light"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-shadow-lg mb-6"
            >
              A Market That
              <span className="italic text-dusty-gold"> Sells Itself</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-cream/90 text-lg md:text-xl leading-relaxed mb-8"
            >
              Flagstaff's proximity to the Grand Canyon drives year-round demand, making it one of Arizona's most lucrative vacation rental markets. Your property deserves to be part of it.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/owners">
                  Start Earning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Owner Testimonials */}
      <section className="py-24 bg-cream-light">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Owner Experiences
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold">
              What Our Owners Say
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                quote: "Since partnering with Flagstaff Escapes, our rental revenue increased by 40%. Their pricing strategy and marketing are second to none.",
                author: "David R.",
                location: "Property Owner, Flagstaff",
              },
              {
                quote: "I live out of state and never worry about my property. They handle everything — guests, maintenance, cleaning — and I just watch the income come in.",
                author: "Karen W.",
                location: "Property Owner, Scottsdale",
              },
              {
                quote: "The monthly reports are detailed and transparent. I always know exactly how my property is performing. Truly a professional operation.",
                author: "James & Lisa P.",
                location: "Property Owners, Phoenix",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-1 text-dusty-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
