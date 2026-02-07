import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useAreaGuides, useAreaGuideActivities } from '@/hooks/useAreaGuides';
import grandCanyonImage from '@/assets/grand-canyon.jpg';
import hikingImage from '@/assets/experiences-hiking.jpg';
import heroImage from '@/assets/hero-home.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

// Fallback images mapping for seeded data without uploaded images
const fallbackImages: Record<string, string> = {
  'grand-canyon': grandCanyonImage,
  'sedona': hikingImage,
  'downtown-flagstaff': heroImage,
};

const Experiences = () => {
  const { data: destinations, isLoading: destinationsLoading } = useAreaGuides();
  const { data: activities, isLoading: activitiesLoading } = useAreaGuideActivities();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={grandCanyonImage}
            alt="Grand Canyon at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              variants={fadeInUp}
              className="text-cream-light/90 uppercase tracking-[0.3em] text-sm font-medium mb-4"
            >
              Explore Northern Arizona
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-7xl text-cream-light text-shadow-lg mb-6"
            >
              Adventure Awaits
              <span className="block italic text-dusty-gold">at Every Turn</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto"
            >
              From the awe-inspiring Grand Canyon to the red rocks of Sedona, Northern Arizona offers endless opportunities for exploration and wonder.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
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
              Must-See Destinations
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold">
              Iconic Experiences Nearby
            </motion.h2>
          </motion.div>

          {destinationsLoading ? (
            <div className="space-y-24">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-24">
              {destinations?.map((dest, index) => {
                const imageUrl = dest.image_url || fallbackImages[dest.slug] || grandCanyonImage;
                
                return (
                  <motion.div
                    key={dest.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <motion.div
                      variants={fadeInUp}
                      className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                        <img
                          src={imageUrl}
                          alt={dest.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="flex items-center gap-6 mb-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{dest.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span>{dest.drive_time}</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-3xl md:text-4xl font-semibold mb-4">{dest.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">{dest.description}</p>

                      {dest.highlights && dest.highlights.length > 0 && (
                        <div className="mb-8">
                          <p className="font-medium mb-3">Highlights:</p>
                          <div className="flex flex-wrap gap-2">
                            {dest.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Activities Grid */}
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
              Things to Do
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold">
              Year-Round Adventures
            </motion.h2>
          </motion.div>

          {activitiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {activities?.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={fadeInUp}
                  className="bg-card rounded-lg p-8 shadow-md"
                >
                  <h3 className="font-serif text-xl font-semibold mb-4 text-primary">{activity.category}</h3>
                  <ul className="space-y-2">
                    {activity.items.map((item) => (
                      <li key={item} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-accent">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center text-primary-foreground"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Ready for Your Adventure?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-cream/80 text-lg mb-8">
              Book your luxury mountain retreat and start exploring everything Northern Arizona has to offer.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Experiences;
