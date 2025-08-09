import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useWatchlist } from "../../contexts/WatchlistContext";
import {
  Play,
  Heart,
  Clock,
  Calendar,
  Star,
  Award,
  Film,
  Target,
  Settings,
  Download,
  Eye,
} from "lucide-react";
import MovieCard from "../MovieCard";
import { cn } from "../../lib/utils";

interface ViewingHistory {
  id: number;
  movie: any;
  watchedAt: Date;
  progress: number; // 0-100
  duration: number; // in minutes
}

interface UserStats {
  moviesWatched: number;
  totalWatchTime: number; // in minutes
  favoriteGenre: string;
  averageRating: number;
  streak: number; // consecutive days watched
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { watchlist, favorites } = useWatchlist();
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "stats" | "achievements"
  >("overview");

  // Mock data - in a real app this would come from your backend
  const [viewingHistory] = useState<ViewingHistory[]>([
    {
      id: 1,
      movie: {
        id: 550,
        title: "Fight Club",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        vote_average: 8.8,
      },
      watchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      progress: 85,
      duration: 139,
    },
    {
      id: 2,
      movie: {
        id: 13,
        title: "Forrest Gump",
        poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        vote_average: 8.8,
      },
      watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      progress: 100,
      duration: 142,
    },
    {
      id: 3,
      movie: {
        id: 155,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        vote_average: 9.0,
      },
      watchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      progress: 100,
      duration: 152,
    },
  ]);

  const [userStats] = useState<UserStats>({
    moviesWatched: 47,
    totalWatchTime: 6840, // in minutes (114 hours)
    favoriteGenre: "Action",
    averageRating: 4.2,
    streak: 12,
    achievements: [],
  });

  const achievements: Achievement[] = [
    {
      id: "first_movie",
      title: "First Steps",
      description: "Watch your first movie",
      icon: <Play className="h-6 w-6" />,
      unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "movie_marathon",
      title: "Movie Marathon",
      description: "Watch 10 movies",
      icon: <Film className="h-6 w-6" />,
      unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: "critic",
      title: "The Critic",
      description: "Rate 25 movies",
      icon: <Star className="h-6 w-6" />,
      unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "binge_watcher",
      title: "Binge Watcher",
      description: "Watch 100 hours of content",
      icon: <Clock className="h-6 w-6" />,
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "streak_master",
      title: "Streak Master",
      description: "Watch movies for 7 consecutive days",
      icon: <Target className="h-6 w-6" />,
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "genre_explorer",
      title: "Genre Explorer",
      description: "Watch movies from 10 different genres",
      icon: <Award className="h-6 w-6" />,
      progress: 8,
      target: 10,
    },
  ];

  const continueWatching = viewingHistory.filter(
    (item) => item.progress > 0 && item.progress < 100,
  );
  const recentlyWatched = viewingHistory
    .filter((item) => item.progress === 100)
    .slice(0, 6);

  const formatWatchTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user.name || "Movie Lover"}!
              </h1>
              <p className="text-muted-foreground">
                Continue your cinematic journey
              </p>
            </div>
          </div>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-6 border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.moviesWatched}</p>
                <p className="text-sm text-muted-foreground">Movies Watched</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg p-6 border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(userStats.totalWatchTime / 60)}h
                </p>
                <p className="text-sm text-muted-foreground">Watch Time</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-lg p-6 border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {userStats.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-lg p-6 border"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userStats.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-8">
          {[
            { id: "overview", label: "Overview" },
            { id: "history", label: "History" },
            { id: "stats", label: "Statistics" },
            { id: "achievements", label: "Achievements" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Continue Watching */}
              {continueWatching.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Continue Watching
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {continueWatching.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card rounded-lg p-4 border"
                      >
                        <div className="flex gap-3">
                          <img
                            src={`https://image.tmdb.org/t/p/w185${item.movie.poster_path}`}
                            alt={item.movie.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium mb-2">
                              {item.movie.title}
                            </h3>
                            <div className="w-full bg-muted rounded-full h-2 mb-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.progress}% watched •{" "}
                              {formatWatchTime(item.duration)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Watched */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Recently Watched</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recentlyWatched.map((item) => (
                    <MovieCard
                      key={item.id}
                      movie={item.movie}
                      showWatchlistButtons={false}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Access */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-6 border hover:bg-card/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Heart className="h-8 w-8 text-red-500" />
                      <div>
                        <h3 className="font-medium">My Favorites</h3>
                        <p className="text-sm text-muted-foreground">
                          {favorites.length} movies
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border hover:bg-card/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Clock className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Watchlist</h3>
                        <p className="text-sm text-muted-foreground">
                          {watchlist.length} movies
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-6 border hover:bg-card/80 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Download className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Downloads</h3>
                        <p className="text-sm text-muted-foreground">
                          0 movies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Viewing History</h2>
              <div className="space-y-4">
                {viewingHistory.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${item.movie.poster_path}`}
                        alt={item.movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.movie.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.watchedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.progress}% watched
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatWatchTime(item.duration)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {item.movie.vote_average}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Watching Habits */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">
                    Watching Habits
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Favorite Genre
                      </span>
                      <span className="font-medium">
                        {userStats.favoriteGenre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Average Session
                      </span>
                      <span className="font-medium">2h 15m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Most Active Day
                      </span>
                      <span className="font-medium">Saturday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Preferred Time
                      </span>
                      <span className="font-medium">8-10 PM</span>
                    </div>
                  </div>
                </div>

                {/* Monthly Progress */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">This Month</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Movies Watched</span>
                        <span>8/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: "80%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Watch Time Goal</span>
                        <span>22h/25h</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "88%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genre Distribution */}
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">
                  Genre Preferences
                </h3>
                <div className="space-y-3">
                  {[
                    { genre: "Action", percentage: 35, count: 16 },
                    { genre: "Drama", percentage: 25, count: 12 },
                    { genre: "Comedy", percentage: 20, count: 9 },
                    { genre: "Sci-Fi", percentage: 15, count: 7 },
                    { genre: "Horror", percentage: 5, count: 3 },
                  ].map((item) => (
                    <div key={item.genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.genre}</span>
                        <span>
                          {item.count} movies ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "bg-card rounded-lg p-6 border transition-all",
                      achievement.unlockedAt
                        ? "border-primary/50 bg-primary/5"
                        : "opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          achievement.unlockedAt
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>

                        {achievement.unlockedAt ? (
                          <p className="text-xs text-primary font-medium">
                            Unlocked {formatDate(achievement.unlockedAt)}
                          </p>
                        ) : achievement.progress !== undefined &&
                          achievement.target ? (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.target}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1">
                              <div
                                className="bg-primary h-1 rounded-full"
                                style={{
                                  width: `${(achievement.progress / achievement.target) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Locked
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
