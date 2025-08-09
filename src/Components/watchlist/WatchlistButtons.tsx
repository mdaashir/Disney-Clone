import React from "react";
import { Heart, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { Movie } from "../../types";

interface WatchlistButtonsProps {
  movie: Movie;
  className?: string;
}

const WatchlistButtons: React.FC<WatchlistButtonsProps> = ({
  movie,
  className = "",
}) => {
  const {
    watchlist,
    favorites,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
  } = useWatchlist();

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);
  const isFavorite = favorites.some((m) => m.id === movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWatchlistToggle}
        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
          isInWatchlist
            ? "bg-blue-600 text-white"
            : "bg-black/50 text-white hover:bg-blue-600"
        }`}
        title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        {isInWatchlist ? <Check size={16} /> : <Plus size={16} />}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleFavoriteToggle}
        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
          isFavorite
            ? "bg-red-600 text-white"
            : "bg-black/50 text-white hover:bg-red-600"
        }`}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Heart size={16} fill={isFavorite ? "white" : "none"} />
      </motion.button>
    </div>
  );
};

export default WatchlistButtons;
