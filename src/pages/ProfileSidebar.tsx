import { useState } from 'react';
import { User, ShoppingBag, HelpCircle, Settings, LogOut } from 'lucide-react';
import { authAPI } from '@/api/modules/auth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileSidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navigate = useNavigate();
  const handleLogout = async () => {
    await authAPI.logout();
    navigate('/signin');
  };

  return (
    <div className="w-80 bg-gradient-card border-r border-border h-screen flex flex-col animate-slide-in">
      {/* Profile Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-primary shadow-glow"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-card flex items-center justify-center">
              <div className="w-2 h-2 bg-card rounded-full"></div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">John Anderson</h2>
            <p className="text-sm text-muted-foreground">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
