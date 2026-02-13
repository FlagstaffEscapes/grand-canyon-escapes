import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin, Clock, X } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  useAreaGuides,
  useAreaGuideActivities,
  useUpdateAreaGuide,
  useDeleteAreaGuide,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  AreaGuideActivity,
} from '@/hooks/useAreaGuides';

const AdminAreaGuides = () => {
  const navigate = useNavigate();
  const { data: guides, isLoading: guidesLoading } = useAreaGuides(true);
  const { data: activities, isLoading: activitiesLoading } = useAreaGuideActivities(true);
  const updateGuide = useUpdateAreaGuide();
  const deleteGuide = useDeleteAreaGuide();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const [deleteGuideId, setDeleteGuideId] = useState<string | null>(null);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
  const [activityDialog, setActivityDialog] = useState<{ open: boolean; activity?: AreaGuideActivity }>({
    open: false,
  });
  const [activityForm, setActivityForm] = useState({ category: '', items: '' });

  const handleToggleGuide = (id: string, is_active: boolean) => {
    updateGuide.mutate({ id, is_active });
  };

  const handleDeleteGuide = () => {
    if (deleteGuideId) {
      deleteGuide.mutate(deleteGuideId);
      setDeleteGuideId(null);
    }
  };

  const handleToggleActivity = (id: string, is_active: boolean) => {
    updateActivity.mutate({ id, is_active });
  };

  const handleDeleteActivity = () => {
    if (deleteActivityId) {
      deleteActivity.mutate(deleteActivityId);
      setDeleteActivityId(null);
    }
  };

  const openActivityDialog = (activity?: AreaGuideActivity) => {
    if (activity) {
      setActivityForm({ category: activity.category, items: activity.items.join('\n') });
    } else {
      setActivityForm({ category: '', items: '' });
    }
    setActivityDialog({ open: true, activity });
  };

  const handleSaveActivity = () => {
    const items = activityForm.items.split('\n').map(i => i.trim()).filter(Boolean);
    const data = {
      category: activityForm.category,
      items,
      display_order: activityDialog.activity?.display_order || (activities?.length || 0) + 1,
      is_active: activityDialog.activity?.is_active ?? true,
    };

    if (activityDialog.activity) {
      updateActivity.mutate({ id: activityDialog.activity.id, ...data });
    } else {
      createActivity.mutate(data);
    }
    setActivityDialog({ open: false });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Area Guide</h1>
          <p className="text-muted-foreground">Manage destinations and activities shown on the Experiences page</p>
        </div>

        <Tabs defaultValue="destinations">
          <TabsList>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-4">
            <div className="flex justify-end">
              <Button asChild>
                <Link to="/admin/area-guides/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Link>
              </Button>
            </div>

            {guidesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {guides?.map((guide) => (
                  <Card key={guide.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate(`/admin/area-guides/${guide.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {guide.image_url && (
                          <img
                            src={guide.image_url}
                            alt={guide.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{guide.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {guide.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {guide.drive_time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {guide.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={guide.is_active}
                              onCheckedChange={(checked) => handleToggleGuide(guide.id, checked)}
                            />
                            <span className="text-sm">{guide.is_active ? 'Active' : 'Draft'}</span>
                          </div>
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/admin/area-guides/${guide.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteGuideId(guide.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openActivityDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {activitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities?.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{activity.category}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={activity.is_active}
                            onCheckedChange={(checked) => handleToggleActivity(activity.id, checked)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => openActivityDialog(activity)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteActivityId(activity.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {activity.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-accent">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Guide Confirmation */}
        <AlertDialog open={!!deleteGuideId} onOpenChange={() => setDeleteGuideId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Destination</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this destination? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGuide} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Activity Confirmation */}
        <AlertDialog open={!!deleteActivityId} onOpenChange={() => setDeleteActivityId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Activity Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this activity category? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteActivity} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Activity Edit Dialog */}
        <Dialog open={activityDialog.open} onOpenChange={(open) => !open && setActivityDialog({ open: false })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {activityDialog.activity ? 'Edit Activity Category' : 'Add Activity Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  value={activityForm.category}
                  onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
                  placeholder="e.g., Winter Adventures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Items (one per line)</Label>
                <textarea
                  id="items"
                  value={activityForm.items}
                  onChange={(e) => setActivityForm({ ...activityForm, items: e.target.value })}
                  placeholder="Arizona Snowbowl skiing&#10;Cross-country skiing&#10;Snowshoeing"
                  className="w-full h-32 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActivityDialog({ open: false })}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveActivity}
                disabled={!activityForm.category.trim()}
              >
                {activityDialog.activity ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAreaGuides;
