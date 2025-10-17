import { Bell, Shield, CreditCard, Globe, Moon, Monitor, Smartphone, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SettingsPanel = () => {
  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { name: 'Email Notifications', description: 'Receive order updates via email', enabled: true },
        { name: 'SMS Notifications', description: 'Receive delivery alerts via SMS', enabled: false },
        { name: 'Push Notifications', description: 'Browser push notifications', enabled: true },
        { name: 'Marketing Emails', description: 'Promotional offers and news', enabled: false }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        { name: 'Two-Factor Authentication', description: 'Add extra security to your account', enabled: true },
        { name: 'Login Alerts', description: 'Get notified of new sign-ins', enabled: true },
        { name: 'Data Sharing', description: 'Share data for personalized experience', enabled: false },
        { name: 'Activity Tracking', description: 'Track browsing for recommendations', enabled: true }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">Account Settings</h3>
        <p className="text-muted-foreground">Manage your account preferences and security settings</p>
      </div>

      {/* Appearance Settings */}
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Appearance</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Theme</label>
            <Select defaultValue="dark">
              <SelectTrigger className="w-full mt-2 bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Language</label>
            <Select defaultValue="en">
              <SelectTrigger className="w-full mt-2 bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Regional Settings</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Time Zone</label>
            <Select defaultValue="est">
              <SelectTrigger className="w-full mt-2 bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                <SelectItem value="cst">Central Time (CST)</SelectItem>
                <SelectItem value="est">Eastern Time (EST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Currency</label>
            <Select defaultValue="usd">
              <SelectTrigger className="w-full mt-2 bg-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="cad">CAD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Toggle Settings */}
      {settingSections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.title} className="p-6 bg-gradient-card border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">{section.title}</h4>
            </div>
            
            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.name} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{setting.name}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Payment Methods */}
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Payment Methods</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">VISA</span>
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4567</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
          
          <Button variant="outline" className="w-full">
            <CreditCard className="w-4 h-4 mr-2" />
            Add New Payment Method
          </Button>
        </div>
      </Card>

      {/* Device Management */}
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Connected Devices</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">Current Device</p>
              <p className="text-sm text-muted-foreground">Chrome on Windows • Last active: Now</p>
            </div>
            <span className="text-xs bg-primary px-2 py-1 rounded text-primary-foreground">Current</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <p className="font-medium text-foreground">iPhone 13</p>
              <p className="text-sm text-muted-foreground">Mobile App • Last active: 2 hours ago</p>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-gradient-card border border-destructive">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-destructive/20 rounded-lg">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <h4 className="text-lg font-semibold text-destructive">Danger Zone</h4>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 rounded-lg">
            <p className="font-medium text-foreground mb-2">Delete Account</p>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;