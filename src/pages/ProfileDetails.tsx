import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { userAPI } from '@/api/modules/user';
import { authAPI } from '@/api/modules/auth';
import { useToast } from '@/components/ui/use-toast';

import ProfileSidebar from './ProfileSidebar';
import HelpSupport from './HelpSupport';
import OrderHistory from './OrderHistory';
import SettingsPanel from './SettingsPanel';

const ProfileDetails = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: profileData
  });

  const onSubmit = async (data: any) => {
    try {
      await userAPI.updateProfile({
        first_name: data.fullName?.split(' ')[0],
        last_name: data.fullName?.split(' ').slice(1).join(' '),
        email: data.email,
        mobile: data.phone,
      });
      setProfileData(data);
      setIsEditOpen(false);
      reset(data);
      toast({ title: 'Profile updated' });
    } catch (e: any) {
      toast({ title: 'Update failed', description: e?.message || 'Could not update profile', variant: 'destructive' });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const prof = await userAPI.getProfile();
        const fullName = [prof?.first_name, prof?.last_name].filter(Boolean).join(' ').trim();
        const address = [
          prof?.address?.address_line_1,
          prof?.address?.address_line_2,
          [prof?.address?.city, prof?.address?.zip_code].filter(Boolean).join(' '),
          prof?.address?.state,
          prof?.address?.country,
        ].filter(Boolean).join('\n');
        const next = {
          fullName: fullName || 'Your name',
          email: prof?.email || '',
          phone: prof?.mobile || '',
          address: address || '',
        };
        setProfileData(next);
        reset(next);
      } catch {
        // ignore initial load failure
      }
    })();
  }, [reset]);

  return (
    <div className="flex h-screen overflow-hidden">
      <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeSection === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            {/* Profile Information Card */}
            <Card className="p-6 bg-gradient-card border border-border">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold text-foreground">Personal Information</h3>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          {...register('fullName')}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                          id="address"
                          {...register('address')}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg text-foreground mt-1">{profileData.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-lg text-foreground mt-1">March 15, 1990</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-lg text-foreground mt-1">Male</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-lg text-foreground mt-1">January 2022</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                    <p className="text-lg text-primary mt-1 font-medium">Premium Active</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                    <p className="text-lg text-foreground mt-1">#CUST-2024-001</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information Card */}
            <Card className="p-6 bg-gradient-card border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-accent rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-lg text-foreground">{profileData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-accent rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-lg text-foreground">{profileData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-accent rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-lg text-foreground">
                      {profileData.address.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < profileData.address.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferences Card */}
            <Card className="p-6 bg-gradient-card border border-border">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Language</label>
                  <p className="text-lg text-foreground mt-1">English (US)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time Zone</label>
                  <p className="text-lg text-foreground mt-1">Eastern Time (ET)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Currency</label>
                  <p className="text-lg text-foreground mt-1">USD ($)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Newsletter</label>
                  <p className="text-lg text-primary mt-1 font-medium">Subscribed</p>
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeSection === 'help' && <HelpSupport />}
        {activeSection === 'orders' && <OrderHistory />}
        {activeSection === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
};

export default ProfileDetails;
