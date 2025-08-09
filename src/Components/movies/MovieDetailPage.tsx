import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Users,
  Download,
  ChevronLeft,
  User,
  Plus,
  Heart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { useAuth } from "../../contexts/AuthContext";
import MovieCard from "../MovieCard";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchMovieVideos,
  fetchByGenre,
  imageBaseUrl,
} from "../../Services/GlobalApi";
import { Video } from "../../types";
import { cn } from "../../lib/utils";
import { QuickShareButton } from "../sharing/ShareSystem";
import { SocialFeatures } from "../social/SocialFeatures";
import toast from "react-hot-toast";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isInWatchlist,
    isInFavorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
  } = useWatchlist();

  const [activeTab, setActiveTab] = useState<
    "overview" | "cast" | "reviews" | "related"
  >("overview");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>("");

  // Fetch movie details
  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(Number(id)),
    enabled: !!id,
  });

  // Fetch movie credits
  const { data: credits } = useQuery({
    queryKey: ["movieCredits", id],
    queryFn: () => fetchMovieCredits(Number(id)),
    enabled: !!id,
  });

  // Fetch movie videos
  const { data: videosData } = useQuery({
    queryKey: ["movieVideos", id],
    queryFn: () => fetchMovieVideos(Number(id)),
    enabled: !!id,
  });

  // Fetch related movies
  const { data: relatedMovies } = useQuery({
    queryKey: ["relatedMovies", movie?.genre_ids?.[0]],
    queryFn: () => fetchByGenre(movie?.genre_ids?.[0] || 28),
    enabled: !!movie?.genre_ids?.[0],
  });

  const videos = videosData?.results || [];
  const trailers = videos.filter((video) => video.type === "Trailer");
  const mainTrailer = trailers[0] || videos[0];

  useEffect(() => {
    if (mainTrailer && !selectedVideo) {
      setSelectedVideo(mainTrailer);
    }
  }, [mainTrailer, selectedVideo]);

  const handleWatchNow = () => {
    if (!user) {
      toast.error("Please sign in to watch movies");
      return;
    }

    navigate(`/watch/${id}`);
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // TODO: Implement review submission
    toast.success("Review submitted successfully!");
    setUserRating(0);
    setUserComment("");
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Movie not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const director = credits?.crew?.find((person) => person.job === "Director");
  const mainCast = credits?.cast?.slice(0, 8) || [];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${imageBaseUrl}/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0"
              >
                <img
                  src={`${imageBaseUrl}/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                />
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 text-white"
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                  {movie.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-white/70">
                      ({movie.vote_count} votes)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{runtime}</span>
                  </div>
                  {director && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{director.name}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-lg text-white/90 mb-8 max-w-3xl leading-relaxed">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleWatchNow}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Play className="h-5 w-5" />
                    Watch Now
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!user) {
                          toast.error("Please sign in to add to watchlist");
                          return;
                        }
                        if (isInWatchlist(movie.id)) {
                          removeFromWatchlist(movie.id);
                        } else {
                          addToWatchlist(movie);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      {isInWatchlist(movie.id)
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"}
                    </button>

                    <button
                      onClick={() => {
                        if (!user) {
                          toast.error("Please sign in to add to favorites");
                          return;
                        }
                        if (isInFavorites(movie.id)) {
                          removeFromFavorites(movie.id);
                        } else {
                          addToFavorites(movie);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isInFavorites(movie.id) &&
                            "fill-current text-red-500",
                        )}
                      />
                      {isInFavorites(movie.id)
                        ? "Favorited"
                        : "Add to Favorites"}
                    </button>
                  </div>

                  <QuickShareButton
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      overview: movie.overview,
                      poster_path: movie.poster_path || undefined,
                      backdrop_path: movie.backdrop_path || undefined,
                    }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors"
                  />

                  <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-8">
          {[
            { id: "overview", label: "Overview" },
            { id: "cast", label: "Cast & Crew" },
            { id: "reviews", label: "Reviews" },
            { id: "related", label: "Related Movies" },
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Video Player */}
                  {selectedVideo && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Trailer</h3>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                          title={selectedVideo.name}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Additional Videos */}
                  {videos.length > 1 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Videos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {videos.slice(0, 6).map((video) => (
                          <button
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={cn(
                              "aspect-video rounded-lg overflow-hidden border-2 transition-colors",
                              selectedVideo?.id === video.id
                                ? "border-primary"
                                : "border-transparent",
                            )}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                              alt={video.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Movie Details */}
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Movie Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Release Date:</span>
                        <span className="ml-2 text-muted-foreground">
                          {new Date(movie.release_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Runtime:</span>
                        <span className="ml-2 text-muted-foreground">
                          {runtime}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span>
                        <span className="ml-2 text-muted-foreground">
                          {movie.budget
                            ? `$${(movie.budget / 1000000).toFixed(1)}M`
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Revenue:</span>
                        <span className="ml-2 text-muted-foreground">
                          {movie.revenue
                            ? `$${(movie.revenue / 1000000).toFixed(1)}M`
                            : "N/A"}
                        </span>
                      </div>
                      {movie.production_companies &&
                        movie.production_companies.length > 0 && (
                          <div>
                            <span className="font-medium">Studio:</span>
                            <span className="ml-2 text-muted-foreground">
                              {movie.production_companies[0].name}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* User Rating */}
                  {user && (
                    <div className="bg-muted rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Rate This Movie
                      </h3>
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                star <= userRating
                                  ? "text-yellow-500 fill-current"
                                  : "text-muted-foreground",
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full p-3 rounded-lg border bg-background text-sm resize-none"
                        rows={4}
                      />
                      <button
                        onClick={handleSubmitReview}
                        className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div className="space-y-8">
                {/* Main Cast */}
                <div>
                  <h3 className="text-xl font-semibold mb-6">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {mainCast.map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-3">
                          {actor.profile_path ? (
                            <img
                              src={`${imageBaseUrl}/w300${actor.profile_path}`}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-1">
                          {actor.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crew */}
                {credits?.crew && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Key Crew</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {credits.crew
                        .filter((person) =>
                          [
                            "Director",
                            "Producer",
                            "Writer",
                            "Cinematographer",
                            "Editor",
                          ].includes(person.job),
                        )
                        .slice(0, 9)
                        .map((person) => (
                          <div
                            key={`${person.id}-${person.job}`}
                            className="flex items-center gap-3 p-3 rounded-lg border"
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                              {person.profile_path ? (
                                <img
                                  src={`${imageBaseUrl}/w185${person.profile_path}`}
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {person.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {person.job}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <SocialFeatures movieId={Number(id)} currentUserId={user?.id} />
            )}

            {activeTab === "related" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Related Movies</h3>
                {relatedMovies && relatedMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {relatedMovies.slice(0, 12).map((relatedMovie) => (
                      <MovieCard key={relatedMovie.id} movie={relatedMovie} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No related movies found
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
