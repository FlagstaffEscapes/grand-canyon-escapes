import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Save, Eye, Loader2, Upload, X, GripVertical, Star,
  Wifi, Flame, Mountain, Waves, Utensils, Tv, Car, Wine, Dumbbell
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  usePropertyById, 
  useCreateProperty, 
  useUpdateProperty,
  useAddPropertyImage,
  useDeletePropertyImage,
  useUpdatePropertyImage 
} from '@/hooks/useProperties';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import BookingCalendar from '@/components/admin/BookingCalendar';

const AMENITY_OPTIONS = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Hot Tub', icon: Waves },
  { name: 'Fireplace', icon: Flame },
  { name: 'Mountain View', icon: Mountain },
  { name: 'Kitchen', icon: Utensils },
  { name: 'Smart TV', icon: Tv },
  { name: 'EV Charger', icon: Car },
  { name: 'Wine Cellar', icon: Wine },
  { name: 'Home Gym', icon: Dumbbell },
  { name: 'Sauna', icon: Waves },
  { name: 'Pool', icon: Waves },
  { name: 'BBQ Grill', icon: Flame },
  { name: 'Fire Pit', icon: Flame },
  { name: 'Game Room', icon: Tv },
  { name: 'Home Theater', icon: Tv },
  { name: 'Deck/Patio', icon: Mountain },
];

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const AdminPropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const { data: property, isLoading } = usePropertyById(isNew ? '' : id || '');
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const addImage = useAddPropertyImage();
  const deleteImage = useDeletePropertyImage();
  const updateImage = useUpdatePropertyImage();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    sleeps: 2,
    sqft: 0,
    price_per_night: 0,
    address: '',
    city: 'Flagstaff',
    state: 'AZ',
    latitude: null as number | null,
    longitude: null as number | null,
    is_featured: false,
    is_active: false,
    amenities: [] as string[],
    house_rules: '',
    check_in_time: '4:00 PM',
    check_out_time: '11:00 AM',
  });

  const [images, setImages] = useState<Array<{
    id?: string;
    image_url: string;
    alt_text?: string;
    display_order: number;
    is_primary: boolean;
    isNew?: boolean;
    file?: File;
  }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (property && !isNew) {
      setFormData({
        name: property.name,
        slug: property.slug,
        tagline: property.tagline || '',
        description: property.description || '',
        bedrooms: property.bedrooms || 1,
        bathrooms: Number(property.bathrooms) || 1,
        sleeps: property.sleeps || 2,
        sqft: property.sqft || 0,
        price_per_night: Number(property.price_per_night) || 0,
        address: property.address || '',
        city: property.city || 'Flagstaff',
        state: property.state || 'AZ',
        latitude: property.latitude ? Number(property.latitude) : null,
        longitude: property.longitude ? Number(property.longitude) : null,
        is_featured: property.is_featured || false,
        is_active: property.is_active || false,
        amenities: property.amenities || [],
        house_rules: property.house_rules || '',
        check_in_time: property.check_in_time || '4:00 PM',
        check_out_time: property.check_out_time || '11:00 AM',
      });
      setImages(
        (property.property_images || [])
          .sort((a, b) => a.display_order - b.display_order)
          .map(img => ({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text || '',
            display_order: img.display_order,
            is_primary: img.is_primary,
          }))
      );
    }
  }, [property, isNew]);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isNew ? generateSlug(name) : prev.slug,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    const newImages: typeof images = [];

    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) {
        toast({
          title: 'Upload Error',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path);

      newImages.push({
        image_url: publicUrl,
        alt_text: formData.name,
        display_order: images.length + newImages.length,
        is_primary: images.length === 0 && newImages.length === 0,
        isNew: true,
      });
    }

    setImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev =>
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id) {
      try {
        await deleteImage.mutateAsync(img.id);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete image',
          variant: 'destructive',
        });
        return;
      }
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (publish: boolean) => {
    if (!formData.name || !formData.slug) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in the property name',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData = {
        ...formData,
        is_active: publish,
        bathrooms: formData.bathrooms,
        price_per_night: formData.price_per_night,
      };

      let propertyId = id;

      if (isNew) {
        const { id: newId } = await createProperty.mutateAsync(propertyData);
        propertyId = newId;
      } else {
        await updateProperty.mutateAsync({ id: id!, ...propertyData });
      }

      // Handle images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.isNew) {
          await addImage.mutateAsync({
            property_id: propertyId!,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: i,
            is_primary: img.is_primary,
          });
        } else if (img.id) {
          await updateImage.mutateAsync({
            id: img.id,
            display_order: i,
            is_primary: img.is_primary,
            alt_text: img.alt_text,
          });
        }
      }

      toast({
        title: publish ? 'Property Published' : 'Property Saved',
        description: publish ? 'Your property is now live!' : 'Changes saved as draft.',
      });

      navigate('/admin/properties');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save property',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/properties')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-serif text-2xl font-semibold">
                {isNew ? 'Add New Property' : 'Edit Property'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isNew ? 'Create a new vacation rental listing' : `Editing: ${property?.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline ml-2">Save Draft</span>
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline ml-2">Publish</span>
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Basic Info */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Basic Information</h2>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Mountain View Cabin"
                />
              </div>
              
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/properties/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="mountain-view-cabin"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="A luxurious retreat in the pines"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the property in detail..."
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Property Details</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="sleeps">Sleeps</Label>
                <Input
                  id="sleeps"
                  type="number"
                  min={1}
                  value={formData.sleeps}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleeps: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="sqft">Sq. Ft.</Label>
                <Input
                  id="sqft"
                  type="number"
                  min={0}
                  value={formData.sqft || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sqft: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={formData.price_per_night || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check_in">Check-in Time</Label>
                <Input
                  id="check_in"
                  value={formData.check_in_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                  placeholder="4:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="check_out">Check-out Time</Label>
                <Input
                  id="check_out"
                  value={formData.check_out_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                  placeholder="11:00 AM"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="house_rules">House Rules</Label>
              <Textarea
                id="house_rules"
                value={formData.house_rules}
                onChange={(e) => setFormData(prev => ({ ...prev, house_rules: e.target.value }))}
                rows={3}
                placeholder="No smoking, no pets, etc."
              />
            </div>
          </section>

          {/* Location */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Location</h2>
            
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Mountain View Dr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity.name}
                  type="button"
                  onClick={() => toggleAmenity(amenity.name)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.amenities.includes(amenity.name)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  <amenity.icon className="w-4 h-4" />
                  <span className="text-sm">{amenity.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Images</h2>
            
            {/* Upload Area */}
            <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Click or drag images here to upload</p>
                </div>
              )}
            </label>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={img.id || index}
                    className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || 'Property image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`p-2 rounded-full ${
                          img.is_primary ? 'bg-dusty-gold text-charcoal' : 'bg-white/20 hover:bg-white/30'
                        }`}
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 rounded-full bg-destructive/80 hover:bg-destructive text-white"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {img.is_primary && (
                      <span className="absolute top-2 left-2 bg-dusty-gold text-charcoal text-xs font-bold px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Booking Calendar - only show for existing properties */}
          {!isNew && id && (
            <BookingCalendar propertyId={id} />
          )}

          {/* Settings */}
          <section className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold">Settings</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Property
                  <span className="text-muted-foreground text-sm block">Display on homepage</span>
                </Label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPropertyEditor;
