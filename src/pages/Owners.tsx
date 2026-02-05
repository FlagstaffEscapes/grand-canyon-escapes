import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, DollarSign, Users, TrendingUp, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import propertyExterior from '@/assets/property-exterior-1.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const Owners = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your interest!",
      description: "We'll be in touch within 24 hours to discuss your property.",
    });
    setFormData({ name: '', email: '', phone: '', propertyAddress: '', message: '' });
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Maximize Revenue',
      description: 'Our dynamic pricing strategy and marketing expertise consistently outperform market averages by 20-30%.',
    },
    {
      icon: Users,
      title: 'Hands-Off Management',
      description: 'From guest communication to cleaning and maintenance, we handle every aspect of property management.',
    },
    {
      icon: TrendingUp,
      title: 'Premium Positioning',
      description: 'Your property joins an exclusive portfolio marketed to affluent travelers seeking luxury accommodations.',
    },
    {
      icon: Shield,
      title: 'Property Protection',
      description: 'Comprehensive screening, professional cleaning, and regular inspections protect your investment.',
    },
  ];

  const services = [
    'Professional photography and listing creation',
    'Dynamic pricing optimization',
    'Multi-platform marketing (Airbnb, VRBO, direct booking)',
    '24/7 guest communication and support',
    'Professional cleaning and turnover service',
    'Regular maintenance and inspections',
    'Supply restocking and inventory management',
    'Monthly financial reporting',
    'Revenue optimization strategies',
    'Emergency response coordination',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={propertyExterior}
            alt="Luxury property management"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/70" />
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
              For Property Owners
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-6xl text-cream-light text-shadow-lg mb-6"
            >
              Turn Your Property Into
              <span className="italic text-dusty-gold"> Passive Income</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-cream/90 text-lg md:text-xl"
            >
              Partner with Flagstaff's premier luxury vacation rental management company
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
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
              Why Partner With Us
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold">
              The Flagstaff Escapes Advantage
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="flex gap-6 p-8 bg-card rounded-lg shadow-md"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center text-primary-foreground"
          >
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.div variants={fadeInUp} className="bg-cream-light/10 rounded-2xl p-10 backdrop-blur-sm">
              <p className="text-7xl md:text-8xl font-serif font-bold text-dusty-gold mb-4">25%</p>
              <p className="text-xl mb-6">Management Commission</p>
              <p className="text-cream/80 leading-relaxed max-w-2xl mx-auto">
                Our 25% commission covers everything: marketing, guest services, cleaning coordination, maintenance oversight, and financial reporting. No hidden fees, no surprise charges.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-accent uppercase tracking-[0.2em] text-sm font-medium mb-4">
                Full-Service Management
              </motion.p>
              <motion.h2 variants={fadeInUp} className="font-serif text-4xl font-semibold mb-6">
                Everything Handled, From Start to Finish
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We provide comprehensive vacation rental management that maximizes your income while minimizing your involvement. Here's what's included:
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{service}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-8 lg:p-10 shadow-xl border border-border"
            >
              <h3 className="font-serif text-2xl font-semibold mb-2">Get Started Today</h3>
              <p className="text-muted-foreground mb-8">
                Tell us about your property and we'll be in touch within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Address</label>
                  <Input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    placeholder="123 Mountain View Dr, Flagstaff, AZ"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tell Us About Your Property</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="Number of bedrooms, current rental status, etc."
                    className="bg-background"
                  />
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full">
                  Submit Inquiry
                </Button>
              </form>

              <div className="border-t border-border mt-8 pt-6">
                <p className="text-sm text-muted-foreground mb-4">Prefer to talk? Reach out directly:</p>
                <div className="space-y-2">
                  <a href="tel:360-775-0592" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    360-775-0592
                  </a>
                  <a href="mailto:owners@flagstaffescapes.com" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                    owners@flagstaffescapes.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Owners;
