import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { useSubmitContact } from '@/hooks/useContacts';
import { supabase } from '@/integrations/supabase/client';
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

const About = () => {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      await submitContact.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `${formData.subject ? `Subject: ${formData.subject}\n\n` : ''}${formData.message}`,
        submission_type: 'general',
      });

      // Send email notification
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'contact',
            data: formData,
          },
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });
      
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="About Us & Contact"
        description="Meet the Flagstaff Escapes team. Local Flagstaff hosts offering luxury vacation rental management near the Grand Canyon. Contact us today."
        canonical="/about"
      />
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Flagstaff Escapes team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.p
              variants={fadeInUp}
              className="text-cream-light/90 uppercase tracking-[0.3em] text-sm font-medium mb-4"
            >
              About Us
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-6xl text-cream-light text-shadow-lg mb-6"
            >
              Your Local Hosts in
              <span className="italic text-dusty-gold"> Flagstaff</span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-cream-light">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.2em] text-sm font-medium mb-4">
                Our Story
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-serif text-4xl font-semibold mb-6">
                Rooted in the Mountains We Love
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Flagstaff Escapes was born from a simple belief: that everyone deserves to experience the magic of Northern Arizona in comfort and style.
                </p>
                <p>
                  As longtime Flagstaff residents and outdoor enthusiasts, we've spent years exploring the trails, savoring the sunsets, and falling deeper in love with this remarkable corner of the world. We created Flagstaff Escapes to share that love with travelers seeking more than just a place to stay.
                </p>
                <p>
                  Our carefully curated collection of luxury vacation homes represents the very best of mountain living. Each property is personally selected for its unique character, premium amenities, and ability to deliver unforgettable experiences.
                </p>
                <p>
                  Whether you're here to witness the grandeur of the Grand Canyon, explore the red rocks of Sedona, or simply unwind by a crackling fire, we're honored to be part of your journey.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-primary rounded-lg p-8 text-primary-foreground text-center">
                  <p className="font-serif text-5xl font-bold mb-2">50+</p>
                  <p className="text-sm opacity-80">5-Star Reviews</p>
                </div>
                <div className="bg-accent rounded-lg p-8 text-accent-foreground text-center">
                  <p className="font-serif text-5xl font-bold mb-2">6</p>
                  <p className="text-sm opacity-80">Luxury Properties</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-card rounded-lg p-8 text-center shadow-lg">
                  <p className="font-serif text-5xl font-bold text-primary mb-2">24/7</p>
                  <p className="text-sm text-muted-foreground">Guest Support</p>
                </div>
                <div className="bg-card rounded-lg p-8 text-center shadow-lg">
                  <p className="font-serif text-5xl font-bold text-primary mb-2">100%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Focus</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
              Get in Touch
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold">
              We'd Love to Hear From You
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <h3 className="font-serif text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <a
                    href="tel:360-775-0592"
                    className="flex items-center gap-4 p-4 bg-card rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">360-775-0592</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@flagstaffescapes.com"
                    className="flex items-center gap-4 p-4 bg-card rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">info@flagstaffescapes.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">Flagstaff, Arizona</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Office Hours</p>
                      <p className="font-medium">Mon-Sat: 9AM - 6PM</p>
                      <p className="text-sm text-muted-foreground">24/7 Guest Support</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-card rounded-xl p-8 lg:p-10 shadow-xl border border-border"
            >
              <h3 className="font-serif text-2xl font-semibold mb-2">Send Us a Message</h3>
              <p className="text-muted-foreground mb-8">
                Have a question about our properties or services? We're here to help.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="General inquiry, booking question, etc."
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                    placeholder="How can we help you?"
                    className="bg-background"
                  />
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
