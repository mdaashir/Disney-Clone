import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Facebook,
  Copy,
  Mail,
  MessageCircle,
  X,
  Check,
} from "lucide-react";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path?: string;
    backdrop_path?: string;
  };
}

export function ShareModal({ isOpen, onClose, movie }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const movieUrl = `${window.location.origin}/movie/${movie.id}`;
  const shareText = `Check out "${movie.title}" - ${movie.overview.slice(0, 100)}...`;

  const shareOptions = [
    {
      name: "Copy Link",
      icon: Copy,
      action: () => copyToClipboard(movieUrl),
      color: "text-gray-600 hover:text-gray-800",
    },
    {
      name: "Twitter",
      icon: Twitter,
      action: () => shareToTwitter(),
      color: "text-blue-500 hover:text-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      action: () => shareToFacebook(),
      color: "text-blue-700 hover:text-blue-800",
    },
    {
      name: "Email",
      icon: Mail,
      action: () => shareViaEmail(),
      color: "text-red-500 hover:text-red-600",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      action: () => shareToWhatsApp(),
      color: "text-green-500 hover:text-green-600",
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(movieUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(movieUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareViaEmail = () => {
    const subject = `Check out "${movie.title}"`;
    const body = `${shareText}\n\nWatch it here: ${movieUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const shareToWhatsApp = () => {
    const text = `${shareText} ${movieUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: movieUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-lg p-6 w-full max-w-md mx-4 border shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Movie
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Movie Info */}
            <div className="flex gap-3 mb-6 p-3 bg-muted rounded-lg">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-18 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{movie.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              {/* Native Share (if supported) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Share2 className="h-5 w-5 text-primary" />
                  <span>Share via system dialog</span>
                </button>
              )}

              {/* Copy Link */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={movieUrl}
                  readOnly
                  className="flex-1 p-3 rounded-lg border bg-muted text-sm"
                />
                <button
                  onClick={() => copyToClipboard(movieUrl)}
                  className={cn(
                    "px-3 py-3 rounded-lg border transition-colors",
                    copied ? "bg-green-500 text-white" : "hover:bg-muted",
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Social Media Options */}
              <div className="grid grid-cols-2 gap-2">
                {shareOptions.slice(1).map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <option.icon className={cn("h-4 w-4", option.color)} />
                    <span className="text-sm">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Tip: Share your favorite movies with friends to start great
                conversations about cinema!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick Share Button Component
export function QuickShareButton({
  movie,
  className,
}: {
  movie: ShareModalProps["movie"];
  className?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-muted transition-colors",
          className,
        )}
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={movie}
      />
    </>
  );
}
