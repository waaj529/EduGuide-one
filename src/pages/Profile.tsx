
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Settings,
  BookOpen,
  Clock,
  Save,
  Edit,
  Camera,
  Link as LinkIcon,
  Trash
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - API Integration Point
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: null,
    institution: 'University of Technology',
    educationLevel: 'undergraduate',
    studyHours: 120,
    joinDate: '2023-01-15',
    emailNotifications: true,
    appNotifications: true,
    studyReminders: true,
    weeklyReports: true,
  });
  
  const handleSaveProfile = () => {
    // API Integration Point: Save profile data
    // const saveProfile = async () => {
    //   try {
    //     await api.users.updateProfile(userData);
    //     toast({
    //       title: "Profile updated",
    //       description: "Your profile information has been updated successfully.",
    //       variant: "default",
    //     });
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: "There was a problem updating your profile.",
    //       variant: "destructive",
    //     });
    //   }
    // };
    // saveProfile();
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    });
    
    setIsEditing(false);
  };
  
  const handleDeleteAccount = () => {
    // API Integration Point: Delete account
    // if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    //   const deleteAccount = async () => {
    //     try {
    //       await api.users.deleteAccount();
    //       // Redirect to home page or login page
    //       window.location.href = "/";
    //     } catch (error) {
    //       toast({
    //         title: "Error",
    //         description: "There was a problem deleting your account.",
    //         variant: "destructive",
    //       });
    //     }
    //   };
    //   deleteAccount();
    // }
    
    toast({
      title: "Account deletion",
      description: "This is where you would integrate account deletion functionality.",
      variant: "destructive",
    });
  };
  
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <Card className="h-fit md:sticky md:top-20">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-3xl font-semibold overflow-hidden">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userData.name.charAt(0)
                    )}
                  </div>
                  <button 
                    className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full"
                    onClick={() => toast({
                      title: "Upload avatar",
                      description: "This is where you would integrate profile picture upload.",
                      variant: "default",
                    })}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-medium">{userData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{userData.email}</p>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6">
                  <p>Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
                  <p>Total study time: {userData.studyHours} hours</p>
                </div>
              </div>
              
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "outline" : "default"} 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-1"
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="institution">Institution</Label>
                      <Input 
                        id="institution" 
                        value={userData.institution}
                        onChange={(e) => setUserData({...userData, institution: e.target.value})}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="education-level">Education Level</Label>
                      <Select 
                        disabled={!isEditing}
                        value={userData.educationLevel}
                        onValueChange={(value) => setUserData({...userData, educationLevel: value})}
                      >
                        <SelectTrigger id="education-level" className="mt-1">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isEditing && (
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how we notify you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={userData.emailNotifications}
                      onCheckedChange={(checked) => setUserData({...userData, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="app-notifications" className="font-normal">App Notifications</Label>
                    </div>
                    <Switch 
                      id="app-notifications" 
                      checked={userData.appNotifications}
                      onCheckedChange={(checked) => setUserData({...userData, appNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="study-reminders" className="font-normal">Study Reminders</Label>
                    </div>
                    <Switch 
                      id="study-reminders" 
                      checked={userData.studyReminders}
                      onCheckedChange={(checked) => setUserData({...userData, studyReminders: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="weekly-reports" className="font-normal">Weekly Progress Reports</Label>
                    </div>
                    <Switch 
                      id="weekly-reports" 
                      checked={userData.weeklyReports}
                      onCheckedChange={(checked) => setUserData({...userData, weeklyReports: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Connected Accounts</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Link your other accounts</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-red-500">Delete Account</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Once deleted, your account cannot be recovered
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
