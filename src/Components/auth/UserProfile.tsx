import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  LogOut,
  User,
  Heart,
  Bookmark,
  History,
  Bell,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile = ({ isOpen, onClose }: UserProfileProps) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "stats"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) return null;

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      name: profileData.name,
      email: profileData.email,
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    await updateProfile({
      preferences: {
        ...user.preferences,
        [key]: value,
      },
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "stats", label: "Statistics", icon: History },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-md border-border/50 max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Profile</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-border/50 pr-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}

              <Button
                variant="destructive"
                className="w-full justify-start gap-3 mt-4"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pl-6 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Profile Information
                    </h3>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={
                        isEditing ? handleSaveProfile : () => setIsEditing(true)
                      }
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Name
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Email
                      </label>
                      <Input
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Member since:{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last login:{" "}
                        {new Date(user.lastLoginAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new content
                        </p>
                      </div>
                      <Switch
                        checked={user.preferences.notifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("notifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autoplay</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically play next episode
                        </p>
                      </div>
                      <Switch
                        checked={user.preferences.autoplay}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("autoplay", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Subtitles</p>
                        <p className="text-sm text-muted-foreground">
                          Show subtitles by default
                        </p>
                      </div>
                      <Switch
                        checked={user.preferences.subtitles}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("subtitles", checked)
                        }
                      />
                    </div>

                    <div>
                      <label className="font-medium mb-2 block">
                        Default Quality
                      </label>
                      <select
                        value={user.preferences.quality}
                        onChange={(e) =>
                          handlePreferenceChange("quality", e.target.value)
                        }
                        className="w-full p-2 rounded-md border border-border bg-background"
                      >
                        <option value="auto">Auto</option>
                        <option value="hd">HD (1080p)</option>
                        <option value="sd">SD (720p)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-medium mb-2 block">Language</label>
                      <select
                        value={user.preferences.language}
                        onChange={(e) =>
                          handlePreferenceChange("language", e.target.value)
                        }
                        className="w-full p-2 rounded-md border border-border bg-background"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Statistics</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Watchlist</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {user.watchlist.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        items saved
                      </p>
                    </div>

                    <div className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">Favorites</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {user.favorites.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        items liked
                      </p>
                    </div>

                    <div className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <History className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Watch History</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {user.watchHistory.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        items watched
                      </p>
                    </div>

                    <div className="p-4 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Continue Watching</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {user.continueWatching.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        in progress
                      </p>
                    </div>
                  </div>

                  {user.watchHistory.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        {user.watchHistory.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-accent/30 rounded"
                          >
                            <div className="w-12 h-8 bg-muted rounded overflow-hidden">
                              {item.poster_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {item.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.watchedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
