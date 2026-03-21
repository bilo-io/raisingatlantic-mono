
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Palette, Languages, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Settings className="mr-3 h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" />Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
            <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
            <Switch id="push-notifications" />
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-muted/50">
            <Label htmlFor="new-feature-updates" className="font-medium">New Feature Updates</Label>
            <Switch id="new-feature-updates" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" />Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
            <Label htmlFor="theme" className="font-medium">Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme" className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
            <Label htmlFor="font-size" className="font-medium">Font Size</Label>
             <Select defaultValue="medium">
              <SelectTrigger id="font-size" className="w-[180px]">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><Languages className="mr-2 h-5 w-5 text-primary" />Language & Region</CardTitle>
          <CardDescription>Set your preferred language and regional settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
            <Label htmlFor="language" className="font-medium">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language" className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
            <Label htmlFor="timezone" className="font-medium">Timezone</Label>
             <Select defaultValue="est">
              <SelectTrigger id="timezone" className="w-[180px]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-destructive"><Trash2 className="mr-2 h-5 w-5" />Account Deletion</CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Warning: This action is irreversible. All your data, including child profiles, notes, and collaboration history, will be permanently erased.
          </p>
          <Button variant="destructive">Delete My Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
