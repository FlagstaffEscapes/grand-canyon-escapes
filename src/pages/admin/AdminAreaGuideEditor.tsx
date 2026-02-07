import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Image } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  useAreaGuideById,
  useCreateAreaGuide,
  useUpdateAreaGuide,
} from '@/hooks/useAreaGuides';

const AdminAreaGuideEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const { data: guide, isLoading } = useAreaGuideById(id);
  const createGuide = useCreateAreaGuide();
  const updateGuide = useUpdateAreaGuide();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    distance: '',
    drive_time: '',
    image_url: '',
    highlights: [] as string[],
    display_order: 0,
    is_active: true,
  });
  const [newHighlight, setNewHighlight] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (guide) {
      setForm({
        title: guide.title,
        slug: guide.slug,
        description: guide.description || '',
        distance: guide.distance || '',
        drive_time: guide.drive_time || '',
        image_url: guide.image_url || '',
        highlights: guide.highlights || [],
        display_order: guide.display_order,
        is_active: guide.is_active,
      });
    }
  }, [guide]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !form.highlights.includes(newHighlight.trim())) {
      setForm((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (highlight: string) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h !== highlight),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `area-guides/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      toast({ title: 'Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: 'Title and slug are required', variant: 'destructive' });
      return;
    }

    try {
      if (isNew) {
        await createGuide.mutateAsync(form);
      } else if (id) {
        await updateGuide.mutateAsync({ id, ...form });
      }
      navigate('/admin/area-guides');
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/admin/area-guides')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold">
                {isNew ? 'Add Destination' : 'Edit Destination'}
              </h1>
              <p className="text-muted-foreground">
                {isNew ? 'Create a new area guide destination' : 'Update destination details'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(is_active) => setForm((prev) => ({ ...prev, is_active }))}
              />
              <Label>{form.is_active ? 'Active' : 'Draft'}</Label>
            </div>
            <Button type="submit" disabled={createGuide.isPending || updateGuide.isPending}>
              {isNew ? 'Create Destination' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Grand Canyon National Park"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="grand-canyon"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this destination..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance</Label>
                    <Input
                      id="distance"
                      value={form.distance}
                      onChange={(e) => setForm((prev) => ({ ...prev, distance: e.target.value }))}
                      placeholder="80 miles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drive_time">Drive Time</Label>
                    <Input
                      id="drive_time"
                      value={form.drive_time}
                      onChange={(e) => setForm((prev) => ({ ...prev, drive_time: e.target.value }))}
                      placeholder="1.5 hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {form.highlights.map((highlight) => (
                    <Badge key={highlight} variant="secondary" className="flex items-center gap-1">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(highlight)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Add a highlight..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddHighlight}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.image_url ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={form.image_url}
                      alt={form.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Image className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No image uploaded</p>
                    </div>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Or paste image URL</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminAreaGuideEditor;
