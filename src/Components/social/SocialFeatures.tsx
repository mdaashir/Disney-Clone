import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Trash2,
  Flag,
  User,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

// Simple date formatting utility
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  dislikes: number;
  replies: Reply[];
  isEdited: boolean;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  reviewId: string;
  comment: string;
  createdAt: Date;
  likes: number;
}

export interface SocialFeaturesProps {
  movieId: number;
  currentUserId?: string;
}

export function SocialFeatures({
  movieId,
  currentUserId,
}: SocialFeaturesProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews([
        {
          id: "1",
          userId: "user1",
          userName: "Movie Buff",
          userAvatar: undefined,
          movieId,
          rating: 5,
          comment:
            "Absolutely amazing! The cinematography and storyline were incredible. This movie exceeded all my expectations and kept me on the edge of my seat throughout.",
          createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
          likes: 24,
          dislikes: 2,
          replies: [
            {
              id: "r1",
              userId: "user2",
              userName: "Cinema Lover",
              reviewId: "1",
              comment: "I totally agree! The visual effects were stunning.",
              createdAt: new Date(Date.now() - 86400000 * 2),
              likes: 8,
            },
          ],
          isEdited: false,
        },
        {
          id: "2",
          userId: "user3",
          userName: "Critical Viewer",
          movieId,
          rating: 3,
          comment:
            "Good movie but felt a bit long. The middle part dragged on but the ending was satisfying.",
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          likes: 12,
          dislikes: 8,
          replies: [],
          isEdited: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [movieId]);

  const handleSubmitReview = () => {
    if (!currentUserId) {
      toast.error("Please log in to leave a review");
      return;
    }

    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: "You", // Replace with actual user name
      movieId,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isEdited: false,
    };

    setReviews((prev) => [review, ...prev]);
    setNewReview({ rating: 0, comment: "" });
    setShowReviewForm(false);
    toast.success("Review submitted successfully!");
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, likes: review.likes + 1 }
          : review,
      ),
    );
    toast.success("Review liked!");
  };

  const handleDislikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, dislikes: review.dislikes + 1 }
          : review,
      ),
    );
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (review && review.userId === currentUserId) {
      setNewReview({
        rating: review.rating,
        comment: review.comment,
      });
      setEditingReview(reviewId);
      setShowReviewForm(true);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    toast.success("Review deleted");
  };

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number;
    // eslint-disable-next-line no-unused-vars
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !readonly && onRatingChange?.(star)}
            disabled={readonly}
            className={cn(
              "transition-colors",
              readonly
                ? "cursor-default"
                : "hover:scale-110 transition-transform",
            )}
          >
            <Star
              className={cn(
                "h-5 w-5",
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300",
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Reviews</h3>
          <p className="text-sm text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {/* Add Review Button */}
      {currentUserId && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full p-4 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors text-center"
        >
          <MessageCircle className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Write a review</p>
        </button>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) =>
                  setNewReview((prev) => ({ ...prev, rating }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Share your thoughts about this movie..."
                className="w-full p-3 border rounded-lg resize-none h-24"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setNewReview({ rating: 0, comment: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 space-y-3"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{review.userName}</h4>
                    {review.isEdited && (
                      <span className="text-xs text-muted-foreground">
                        (edited)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {review.userId === currentUserId && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditReview(review.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Rating */}
            <StarRating rating={review.rating} readonly />

            {/* Comment */}
            <p className="text-sm leading-relaxed">{review.comment}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <button
                onClick={() => handleLikeReview(review.id)}
                className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                {review.likes}
              </button>
              <button
                onClick={() => handleDislikeReview(review.id)}
                className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
              >
                <ThumbsDown className="h-4 w-4" />
                {review.dislikes}
              </button>
              <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
                Reply
              </button>
              <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {review.userId !== currentUserId && (
                <button className="flex items-center gap-1 text-sm hover:text-red-500 transition-colors ml-auto">
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              )}
            </div>

            {/* Replies */}
            {review.replies.length > 0 && (
              <div className="ml-8 space-y-3 pt-3 border-t">
                {review.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {reply.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{reply.comment}</p>
                      <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors mt-1">
                        <ThumbsUp className="h-3 w-3" />
                        {reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 0 && (
        <div className="text-center">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
