import type { Plugin } from 'vite';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const SITE_URL = 'https://flagstaffescapes.lovable.app';

interface RouteConfig {
  path: string;
  title: string;
  description: string;
  content: string;
}

const ROUTES_TO_PRERENDER: RouteConfig[] = [
  {
    path: '/',
    title: 'Flagstaff Escapes — Luxury Vacation Rentals in Flagstaff, AZ',
    description: 'Luxury vacation rentals in Flagstaff, Arizona near the Grand Canyon. Handpicked cabins and mountain homes with stunning views, premium amenities, and full-service management.',
    content: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #2c2c2c; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; padding: 80px 20px;">
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; color: #8b7355;">Vacation Rental Management • Flagstaff, Arizona</p>
          <h1 style="font-size: 56px; margin: 20px 0;">Flagstaff Escapes</h1>
          <p style="font-size: 24px; font-style: italic; color: #c4a265;">Premier Rental Management</p>
          <p style="font-size: 18px; max-width: 600px; margin: 20px auto; line-height: 1.6;">We turn luxury properties into top-performing vacation rentals. Full-service management, maximum returns.</p>
        </header>

        <section style="padding: 60px 20px; text-align: center;">
          <h2 style="font-size: 36px; margin-bottom: 40px;">Why Property Owners Choose Flagstaff Escapes</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 22px; margin-bottom: 12px;">Maximize Revenue</h3>
              <p style="color: #666; line-height: 1.6;">Dynamic pricing and multi-platform marketing that consistently outperforms market averages for our owners in the Flagstaff vacation rental market.</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 22px; margin-bottom: 12px;">Hands-Off Management</h3>
              <p style="color: #666; line-height: 1.6;">Full-service vacation rental operations from guest communication and bookings to professional cleaning, maintenance, and detailed reporting.</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 22px; margin-bottom: 12px;">Local Expertise</h3>
              <p style="color: #666; line-height: 1.6;">Deep Flagstaff knowledge and a curated luxury brand that attracts premium guests and repeat bookings to your mountain property.</p>
            </div>
          </div>
        </section>

        <section style="padding: 60px 20px; background: #3a4a3f; color: #f5f0e8; text-align: center; border-radius: 12px; margin: 20px 0;">
          <h2 style="font-size: 36px; margin-bottom: 20px;">Maximize Your Property's Potential</h2>
          <p style="font-size: 18px; max-width: 700px; margin: 0 auto 30px; line-height: 1.6;">Partner with Flagstaff's premier vacation rental management company. We handle everything from marketing to guest services, so you can enjoy passive income without the hassle.</p>
          <a href="/owners" style="display: inline-block; padding: 14px 32px; background: #c4a265; color: #2c2c2c; text-decoration: none; border-radius: 6px; font-weight: bold;">Learn About Management</a>
        </section>

        <section style="padding: 60px 20px; text-align: center;">
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 13px; color: #8b7355; margin-bottom: 10px;">Our Portfolio</p>
          <h2 style="font-size: 36px; margin-bottom: 20px;">Properties We Manage</h2>
          <p style="color: #666; max-width: 600px; margin: 0 auto 30px; font-size: 18px;">See the luxury vacation rental properties thriving under our management — from intimate cabins to grand mountain estates near the Grand Canyon.</p>
          <a href="/properties" style="display: inline-block; padding: 14px 32px; background: #3a4a3f; color: #f5f0e8; text-decoration: none; border-radius: 6px; font-weight: bold;">View All Properties</a>
        </section>

        <section style="padding: 60px 20px; text-align: center;">
          <h2 style="font-size: 42px; margin-bottom: 20px;">A Market That <em style="color: #c4a265;">Sells Itself</em></h2>
          <p style="font-size: 18px; max-width: 700px; margin: 0 auto; line-height: 1.6;">Flagstaff's proximity to the Grand Canyon drives year-round demand, making it one of Arizona's most lucrative vacation rental markets. Your property deserves to be part of it.</p>
        </section>

        <section style="padding: 60px 20px;">
          <h2 style="font-size: 36px; text-align: center; margin-bottom: 40px;">What Our Owners Say</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px; margin-bottom: 12px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin-bottom: 16px;">"Since partnering with Flagstaff Escapes, our rental revenue increased by 40%. Their pricing strategy and marketing are second to none."</p>
              <p style="font-weight: bold;">David R.</p>
              <p style="color: #666; font-size: 14px;">Property Owner, Flagstaff</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px; margin-bottom: 12px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin-bottom: 16px;">"I live out of state and never worry about my property. They handle everything — guests, maintenance, cleaning — and I just watch the income come in."</p>
              <p style="font-weight: bold;">Karen W.</p>
              <p style="color: #666; font-size: 14px;">Property Owner, Scottsdale</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px; margin-bottom: 12px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin-bottom: 16px;">"The monthly reports are detailed and transparent. I always know exactly how my property is performing. Truly a professional operation."</p>
              <p style="font-weight: bold;">James &amp; Lisa P.</p>
              <p style="color: #666; font-size: 14px;">Property Owners, Phoenix</p>
            </div>
          </div>
        </section>

        <footer style="text-align: center; padding: 40px 20px; border-top: 1px solid #e5e0d8; margin-top: 40px;">
          <p style="font-size: 24px; margin-bottom: 10px;">Flagstaff Escapes</p>
          <p style="color: #666;">Luxury Vacation Rental Management in Flagstaff, Arizona</p>
          <p style="color: #666; margin-top: 10px;">Phone: <a href="tel:360-775-0592" style="color: #3a4a3f;">360-775-0592</a> | Email: <a href="mailto:info@flagstaffescapes.com" style="color: #3a4a3f;">info@flagstaffescapes.com</a></p>
          <nav style="margin-top: 20px;">
            <a href="/properties" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Properties</a>
            <a href="/owners" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">For Owners</a>
            <a href="/experiences" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Area Guide</a>
            <a href="/about" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">About &amp; Contact</a>
          </nav>
        </footer>
      </div>
    `,
  },
  {
    path: '/properties',
    title: 'Luxury Vacation Rentals | Flagstaff Escapes',
    description: 'Browse handpicked luxury vacation rental cabins and mountain homes in Flagstaff, Arizona. Near the Grand Canyon with premium amenities.',
    content: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #2c2c2c; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; padding: 80px 20px;">
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; color: #8b7355;">Luxury Vacation Rentals</p>
          <h1 style="font-size: 48px; margin: 20px 0;">Our Properties</h1>
          <p style="font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6;">Browse our collection of handpicked luxury vacation rental homes in Flagstaff, Arizona near the Grand Canyon</p>
        </header>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; margin-bottom: 20px;">Luxury Cabins and Mountain Homes in Flagstaff</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 20px;">Discover our curated collection of premium vacation rental properties in Flagstaff, Arizona. Each home has been personally selected for its exceptional quality, stunning location, and premium amenities. Whether you're planning a romantic mountain getaway, a family vacation near the Grand Canyon, or a group retreat in the pines, our Flagstaff vacation rentals offer the perfect base for your Northern Arizona adventure.</p>
          <p style="font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 20px;">Our luxury cabins and mountain homes feature modern amenities including fully equipped gourmet kitchens, hot tubs, fireplaces, and outdoor living spaces surrounded by the Coconino National Forest. Every property is maintained to the highest standards with professional cleaning, premium linens, and thoughtful touches that make your stay unforgettable.</p>
          <p style="font-size: 16px; line-height: 1.8; color: #555;">Located just 80 miles from the Grand Canyon South Rim and 30 miles from Sedona, Flagstaff is the ideal destination for exploring Northern Arizona's most iconic landmarks while enjoying the comfort of a luxury mountain retreat.</p>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">Why Book a Flagstaff Vacation Rental?</h2>
          <ul style="font-size: 16px; line-height: 2; color: #555; list-style: disc; padding-left: 24px;">
            <li>Proximity to Grand Canyon National Park — just 80 miles south</li>
            <li>Easy day trips to Sedona red rocks, Meteor Crater, and Walnut Canyon</li>
            <li>Year-round activities: hiking, skiing at Arizona Snowbowl, mountain biking</li>
            <li>Charming downtown Flagstaff with local restaurants and breweries</li>
            <li>Cool mountain climate — escape the Arizona desert heat</li>
            <li>Professional property management with 24/7 guest support</li>
            <li>Premium amenities: hot tubs, fireplaces, gourmet kitchens</li>
          </ul>
        </section>

        <footer style="text-align: center; padding: 40px 20px; border-top: 1px solid #e5e0d8; margin-top: 40px;">
          <p style="font-size: 24px; margin-bottom: 10px;">Flagstaff Escapes</p>
          <p style="color: #666;">Luxury Vacation Rental Management in Flagstaff, Arizona</p>
          <p style="color: #666; margin-top: 10px;">Phone: <a href="tel:360-775-0592" style="color: #3a4a3f;">360-775-0592</a> | Email: <a href="mailto:info@flagstaffescapes.com" style="color: #3a4a3f;">info@flagstaffescapes.com</a></p>
          <nav style="margin-top: 20px;">
            <a href="/" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Home</a>
            <a href="/owners" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">For Owners</a>
            <a href="/experiences" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Area Guide</a>
            <a href="/about" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">About &amp; Contact</a>
          </nav>
        </footer>
      </div>
    `,
  },
  {
    path: '/owners',
    title: 'Property Owners — Vacation Rental Management | Flagstaff Escapes',
    description: 'Turn your Flagstaff property into passive income. Full-service vacation rental management with 25% commission, no contracts, and maximum revenue.',
    content: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #2c2c2c; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; padding: 80px 20px;">
          <p style="font-size: 24px; font-style: italic; color: #c4a265;">Flagstaff Escapes</p>
          <h1 style="font-size: 48px; margin: 20px 0;">Turn Your Property Into <em style="color: #c4a265;">Passive Income</em></h1>
          <p style="font-size: 18px; max-width: 600px; margin: 0 auto;">Full-service vacation rental management. Maximum returns, zero hassle.</p>
        </header>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">The Flagstaff Escapes Advantage</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
            <div style="flex: 1; min-width: 280px; max-width: 500px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; margin-bottom: 8px;">Maximize Revenue</h3>
              <p style="color: #666; line-height: 1.6;">Our dynamic pricing strategy and marketing expertise consistently outperform Flagstaff vacation rental market averages by 20-30%.</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 500px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; margin-bottom: 8px;">Hands-Off Management</h3>
              <p style="color: #666; line-height: 1.6;">From guest communication to professional cleaning and maintenance, we handle every aspect of vacation rental property management.</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 500px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; margin-bottom: 8px;">Premium Positioning</h3>
              <p style="color: #666; line-height: 1.6;">Your property joins an exclusive portfolio marketed to affluent travelers seeking luxury accommodations in Flagstaff and Northern Arizona.</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 500px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; margin-bottom: 8px;">Property Protection</h3>
              <p style="color: #666; line-height: 1.6;">Comprehensive guest screening, professional cleaning, and regular inspections protect your vacation rental investment.</p>
            </div>
          </div>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">How It Works</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
            <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 24px; text-align: center; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #8b7355; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em;">Step 01</p>
              <h3 style="font-size: 20px; margin: 8px 0;">Schedule a Consultation</h3>
              <p style="color: #666; line-height: 1.6;">We evaluate your property, discuss your goals, and outline a custom management plan tailored to maximize your returns.</p>
            </div>
            <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 24px; text-align: center; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #8b7355; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em;">Step 02</p>
              <h3 style="font-size: 20px; margin: 8px 0;">We Handle Setup</h3>
              <p style="color: #666; line-height: 1.6;">Professional photography, compelling listing creation, pricing strategy, and multi-platform distribution — all handled by our team.</p>
            </div>
            <div style="flex: 1; min-width: 250px; max-width: 350px; padding: 24px; text-align: center; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #8b7355; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em;">Step 03</p>
              <h3 style="font-size: 20px; margin: 8px 0;">Start Earning</h3>
              <p style="color: #666; line-height: 1.6;">Sit back while we manage everything — bookings, guests, cleaning, maintenance — and watch your vacation rental returns grow.</p>
            </div>
          </div>
        </section>

        <section style="padding: 60px 20px; background: #3a4a3f; color: #f5f0e8; text-align: center; border-radius: 12px; margin: 20px 0;">
          <h2 style="font-size: 36px; margin-bottom: 20px;">Simple, Transparent Pricing</h2>
          <p style="font-size: 72px; font-weight: bold; color: #c4a265; margin: 10px 0;">25%</p>
          <p style="font-size: 20px; margin-bottom: 20px;">Management Commission</p>
          <p style="font-size: 24px; margin-bottom: 20px;">You keep <strong style="color: #c4a265;">75%</strong> — we earn our share by maximizing yours.</p>
          <ul style="list-style: none; padding: 0; max-width: 600px; margin: 0 auto; text-align: left;">
            <li style="padding: 6px 0;">✓ Multi-platform marketing &amp; listing management</li>
            <li style="padding: 6px 0;">✓ Guest communication &amp; 24/7 support</li>
            <li style="padding: 6px 0;">✓ Professional cleaning coordination</li>
            <li style="padding: 6px 0;">✓ Maintenance, inspections &amp; financial reporting</li>
          </ul>
          <p style="margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.8;">No startup fees • No contracts • Cancel anytime</p>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 20px;">Full-Service Vacation Rental Management</h2>
          <ul style="font-size: 16px; line-height: 2.2; color: #555; list-style: none; padding: 0; max-width: 600px; margin: 0 auto;">
            <li>✓ Professional photography and listing creation</li>
            <li>✓ Dynamic pricing optimization</li>
            <li>✓ Multi-platform marketing (Airbnb, VRBO, direct booking)</li>
            <li>✓ 24/7 guest communication and support</li>
            <li>✓ Professional cleaning and turnover service</li>
            <li>✓ Regular maintenance and inspections</li>
            <li>✓ Supply restocking and inventory management</li>
            <li>✓ Monthly financial reporting</li>
            <li>✓ Revenue optimization strategies</li>
            <li>✓ Emergency response coordination</li>
          </ul>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">What Our Owners Say</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin: 12px 0;">"Since partnering with Flagstaff Escapes, our rental revenue increased by 40%."</p>
              <p style="font-weight: bold;">David R. — Property Owner, Flagstaff</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin: 12px 0;">"I live out of state and never worry about my property. They handle everything."</p>
              <p style="font-weight: bold;">Karen W. — Property Owner, Scottsdale</p>
            </div>
            <div style="flex: 1; min-width: 280px; max-width: 350px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <p style="color: #c4a265; font-size: 20px;">★★★★★</p>
              <p style="font-style: italic; line-height: 1.6; margin: 12px 0;">"The monthly reports are detailed and transparent. Truly a professional operation."</p>
              <p style="font-weight: bold;">James &amp; Lisa P. — Property Owners, Phoenix</p>
            </div>
          </div>
        </section>

        <section style="padding: 40px 20px; text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 16px;">Get Started Today</h2>
          <p style="color: #666; margin-bottom: 20px;">Tell us about your property and we'll be in touch within 24 hours.</p>
          <p style="color: #666;">Phone: <a href="tel:360-775-0592" style="color: #3a4a3f;">360-775-0592</a> | Email: <a href="mailto:info@flagstaffescapes.com" style="color: #3a4a3f;">info@flagstaffescapes.com</a></p>
        </section>

        <footer style="text-align: center; padding: 40px 20px; border-top: 1px solid #e5e0d8; margin-top: 40px;">
          <nav>
            <a href="/" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Home</a>
            <a href="/properties" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Properties</a>
            <a href="/experiences" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Area Guide</a>
            <a href="/about" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">About &amp; Contact</a>
          </nav>
        </footer>
      </div>
    `,
  },
  {
    path: '/experiences',
    title: 'Area Guide & Experiences | Flagstaff Escapes',
    description: 'Explore Northern Arizona from Flagstaff. Grand Canyon, Sedona, hiking, skiing, and year-round adventures near our luxury vacation rentals.',
    content: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #2c2c2c; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; padding: 80px 20px;">
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; color: #8b7355;">Explore Northern Arizona</p>
          <h1 style="font-size: 48px; margin: 20px 0;">Adventure Awaits <em style="color: #c4a265;">at Every Turn</em></h1>
          <p style="font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6;">From the awe-inspiring Grand Canyon to the red rocks of Sedona, Northern Arizona offers endless opportunities for exploration and wonder.</p>
        </header>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">Iconic Destinations Near Flagstaff</h2>
          
          <article style="margin-bottom: 40px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
            <h3 style="font-size: 28px; margin-bottom: 8px;">Grand Canyon National Park</h3>
            <p style="color: #8b7355; margin-bottom: 12px;">80 miles south • ~1.5 hour drive from Flagstaff</p>
            <p style="color: #555; line-height: 1.8; margin-bottom: 16px;">One of the Seven Natural Wonders of the World, the Grand Canyon is an absolute must-visit destination when staying in Flagstaff. The South Rim offers breathtaking viewpoints, world-class hiking trails including Bright Angel Trail and South Kaibab Trail, ranger-led programs, and stunning sunrise and sunset viewing opportunities. As one of the most visited national parks in the United States, the Grand Canyon draws millions of visitors each year — and Flagstaff is the perfect gateway city for exploring this iconic landmark.</p>
            <p style="color: #555; line-height: 1.8;">Highlights: South Rim viewpoints, Bright Angel Trail hiking, Desert View Watchtower, mule rides, helicopter tours, river rafting adventures on the Colorado River</p>
          </article>

          <article style="margin-bottom: 40px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
            <h3 style="font-size: 28px; margin-bottom: 8px;">Sedona Red Rocks</h3>
            <p style="color: #8b7355; margin-bottom: 12px;">30 miles south • ~45 minute drive from Flagstaff</p>
            <p style="color: #555; line-height: 1.8; margin-bottom: 16px;">Famous for its stunning red sandstone formations, world-class hiking, art galleries, and spiritual energy vortexes, Sedona is an easy day trip from any Flagstaff vacation rental. Cathedral Rock, Bell Rock, and Devil's Bridge are among the most photographed natural landmarks in Arizona. The scenic drive from Flagstaff through Oak Creek Canyon is one of the most beautiful drives in the American Southwest.</p>
            <p style="color: #555; line-height: 1.8;">Highlights: Cathedral Rock hiking, Bell Rock vortex, Tlaquepaque Arts Village, Slide Rock State Park, jeep tours, wine tasting in the Verde Valley</p>
          </article>

          <article style="margin-bottom: 40px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
            <h3 style="font-size: 28px; margin-bottom: 8px;">Downtown Flagstaff</h3>
            <p style="color: #8b7355; margin-bottom: 12px;">In the heart of the city</p>
            <p style="color: #555; line-height: 1.8;">Historic Route 66 runs through the heart of downtown Flagstaff, a vibrant area filled with locally owned restaurants, craft breweries, art galleries, and unique shops. Explore the Lowell Observatory where Pluto was discovered, stroll through Heritage Square, and experience the charm of this authentic mountain town. Flagstaff's cultural scene includes live music, festivals, and a thriving food scene featuring Northern Arizona's best dining.</p>
          </article>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">Year-Round Adventures in Flagstaff</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
            <div style="flex: 1; min-width: 220px; max-width: 280px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; color: #3a4a3f; margin-bottom: 12px;">Hiking &amp; Nature</h3>
              <ul style="list-style: disc; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Humphreys Peak (highest point in Arizona)</li>
                <li>Kachina Trail</li>
                <li>Walnut Canyon National Monument</li>
                <li>Coconino National Forest</li>
              </ul>
            </div>
            <div style="flex: 1; min-width: 220px; max-width: 280px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; color: #3a4a3f; margin-bottom: 12px;">Winter Sports</h3>
              <ul style="list-style: disc; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Arizona Snowbowl skiing &amp; snowboarding</li>
                <li>Cross-country skiing</li>
                <li>Snowshoeing in the pines</li>
                <li>Sledding &amp; tubing</li>
              </ul>
            </div>
            <div style="flex: 1; min-width: 220px; max-width: 280px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; color: #3a4a3f; margin-bottom: 12px;">Culture &amp; Dining</h3>
              <ul style="list-style: disc; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Historic Route 66</li>
                <li>Lowell Observatory</li>
                <li>Local craft breweries</li>
                <li>Farm-to-table restaurants</li>
              </ul>
            </div>
            <div style="flex: 1; min-width: 220px; max-width: 280px; padding: 24px; border: 1px solid #e5e0d8; border-radius: 8px;">
              <h3 style="font-size: 20px; color: #3a4a3f; margin-bottom: 12px;">Family Activities</h3>
              <ul style="list-style: disc; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Bearizona Wildlife Park</li>
                <li>Sunset Crater Volcano</li>
                <li>Meteor Crater</li>
                <li>Flagstaff Extreme Adventure Course</li>
              </ul>
            </div>
          </div>
        </section>

        <section style="padding: 40px 20px; text-align: center; background: #3a4a3f; color: #f5f0e8; border-radius: 12px; margin: 20px 0;">
          <h2 style="font-size: 36px; margin-bottom: 16px;">Ready for Your Adventure?</h2>
          <p style="font-size: 18px; margin-bottom: 24px;">Book your luxury mountain retreat and start exploring everything Northern Arizona has to offer.</p>
          <a href="/properties" style="display: inline-block; padding: 14px 32px; background: #c4a265; color: #2c2c2c; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Properties</a>
        </section>

        <footer style="text-align: center; padding: 40px 20px; border-top: 1px solid #e5e0d8; margin-top: 40px;">
          <nav>
            <a href="/" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Home</a>
            <a href="/properties" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Properties</a>
            <a href="/owners" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">For Owners</a>
            <a href="/about" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">About &amp; Contact</a>
          </nav>
        </footer>
      </div>
    `,
  },
  {
    path: '/about',
    title: 'About Us & Contact | Flagstaff Escapes',
    description: 'Meet the Flagstaff Escapes team. Local Flagstaff hosts offering luxury vacation rental management near the Grand Canyon. Contact us today.',
    content: `
      <div style="font-family: Georgia, 'Times New Roman', serif; color: #2c2c2c; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; padding: 80px 20px;">
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 14px; color: #8b7355;">About Us</p>
          <h1 style="font-size: 48px; margin: 20px 0;">Your Local Hosts in <em style="color: #c4a265;">Flagstaff</em></h1>
        </header>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; margin-bottom: 20px;">Rooted in the Mountains We Love</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 16px;">Flagstaff Escapes was born from a simple belief: that everyone deserves to experience the magic of Northern Arizona in comfort and style.</p>
          <p style="font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 16px;">As longtime Flagstaff residents and outdoor enthusiasts, we've spent years exploring the trails, savoring the sunsets, and falling deeper in love with this remarkable corner of the world. We created Flagstaff Escapes to share that love with travelers seeking more than just a place to stay.</p>
          <p style="font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 16px;">Our carefully curated collection of luxury vacation homes represents the very best of mountain living. Each property is personally selected for its unique character, premium amenities, and ability to deliver unforgettable experiences.</p>
          <p style="font-size: 16px; line-height: 1.8; color: #555;">Whether you're here to witness the grandeur of the Grand Canyon, explore the red rocks of Sedona, or simply unwind by a crackling fire, we're honored to be part of your journey.</p>
        </section>

        <section style="padding: 40px 20px;">
          <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
            <div style="text-align: center; padding: 24px; min-width: 150px;">
              <p style="font-size: 48px; font-weight: bold; color: #3a4a3f;">50+</p>
              <p style="color: #666;">5-Star Reviews</p>
            </div>
            <div style="text-align: center; padding: 24px; min-width: 150px;">
              <p style="font-size: 48px; font-weight: bold; color: #3a4a3f;">6</p>
              <p style="color: #666;">Luxury Properties</p>
            </div>
            <div style="text-align: center; padding: 24px; min-width: 150px;">
              <p style="font-size: 48px; font-weight: bold; color: #3a4a3f;">24/7</p>
              <p style="color: #666;">Guest Support</p>
            </div>
            <div style="text-align: center; padding: 24px; min-width: 150px;">
              <p style="font-size: 48px; font-weight: bold; color: #3a4a3f;">100%</p>
              <p style="color: #666;">Satisfaction Focus</p>
            </div>
          </div>
        </section>

        <section style="padding: 40px 20px;">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 30px;">Contact Flagstaff Escapes</h2>
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="padding: 16px; border: 1px solid #e5e0d8; border-radius: 8px;">
                <p style="color: #666; font-size: 14px;">Phone</p>
                <p style="font-weight: bold;"><a href="tel:360-775-0592" style="color: #3a4a3f; text-decoration: none;">360-775-0592</a></p>
              </div>
              <div style="padding: 16px; border: 1px solid #e5e0d8; border-radius: 8px;">
                <p style="color: #666; font-size: 14px;">Email</p>
                <p style="font-weight: bold;"><a href="mailto:info@flagstaffescapes.com" style="color: #3a4a3f; text-decoration: none;">info@flagstaffescapes.com</a></p>
              </div>
              <div style="padding: 16px; border: 1px solid #e5e0d8; border-radius: 8px;">
                <p style="color: #666; font-size: 14px;">Location</p>
                <p style="font-weight: bold;">Flagstaff, Arizona</p>
              </div>
              <div style="padding: 16px; border: 1px solid #e5e0d8; border-radius: 8px;">
                <p style="color: #666; font-size: 14px;">Office Hours</p>
                <p style="font-weight: bold;">Mon-Sat: 9AM - 6PM</p>
                <p style="color: #666; font-size: 14px;">24/7 Guest Support</p>
              </div>
            </div>
          </div>
        </section>

        <footer style="text-align: center; padding: 40px 20px; border-top: 1px solid #e5e0d8; margin-top: 40px;">
          <nav>
            <a href="/" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Home</a>
            <a href="/properties" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Properties</a>
            <a href="/owners" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">For Owners</a>
            <a href="/experiences" style="color: #3a4a3f; margin: 0 12px; text-decoration: none;">Area Guide</a>
          </nav>
        </footer>
      </div>
    `,
  },
];

function updateMetaTag(html: string, property: string, content: string): string {
  // Handle both name= and property= attributes
  const nameRegex = new RegExp(`<meta\\s+name="${property}"\\s+content="[^"]*"`, 'g');
  const propRegex = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"`, 'g');

  html = html.replace(nameRegex, `<meta name="${property}" content="${content}"`);
  html = html.replace(propRegex, `<meta property="${property}" content="${content}"`);

  return html;
}

export function seoPrerender(): Plugin {
  return {
    name: 'seo-prerender',
    apply: 'build',
    enforce: 'post',
    closeBundle: {
      sequential: true,
      async handler() {
        const distDir = resolve(process.cwd(), 'dist');
        const indexPath = resolve(distDir, 'index.html');

        if (!existsSync(indexPath)) {
          console.warn('[seo-prerender] dist/index.html not found, skipping pre-render');
          return;
        }

        const baseHtml = readFileSync(indexPath, 'utf-8');
        console.log(`[seo-prerender] Pre-rendering ${ROUTES_TO_PRERENDER.length} routes...`);

        for (const route of ROUTES_TO_PRERENDER) {
          let html = baseHtml;

          // Update title
          html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

          // Update meta tags
          html = updateMetaTag(html, 'description', route.description);
          html = updateMetaTag(html, 'og:title', route.title);
          html = updateMetaTag(html, 'og:description', route.description);
          html = updateMetaTag(html, 'twitter:title', route.title);
          html = updateMetaTag(html, 'twitter:description', route.description);
          html = updateMetaTag(html, 'og:url', `${SITE_URL}${route.path}`);

          // Add canonical link if not present
          if (!html.includes('rel="canonical"')) {
            html = html.replace('</head>', `  <link rel="canonical" href="${SITE_URL}${route.path}" />\n</head>`);
          } else {
            html = html.replace(
              /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
              `<link rel="canonical" href="${SITE_URL}${route.path}" />`
            );
          }

          // Inject static content inside root div
          html = html.replace(
            '<div id="root"></div>',
            `<div id="root" data-prerendered="${route.path}">${route.content}</div>`
          );

          // Add noscript fallback
          html = html.replace(
            '</body>',
            `<noscript><style>#root[data-prerendered] { display: block !important; }</style></noscript>\n</body>`
          );

          // Determine output path
          const outputDir = route.path === '/'
            ? distDir
            : resolve(distDir, route.path.replace(/^\//, ''));

          const outputPath = route.path === '/'
            ? indexPath
            : resolve(outputDir, 'index.html');

          // Create directory if needed
          if (route.path !== '/') {
            mkdirSync(dirname(outputPath), { recursive: true });
          }

          writeFileSync(outputPath, html, 'utf-8');
          console.log(`[seo-prerender] ✓ ${route.path} → ${outputPath.replace(distDir, 'dist')}`);
        }

        console.log(`[seo-prerender] Done! ${ROUTES_TO_PRERENDER.length} routes pre-rendered.`);
      },
    },
  };
}
