"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTripById } from "@/lib/api/trip";
import { submitFeedback } from "@/lib/api/feedback";
import type { TripDto, FeedbackEntity } from "@/types";
import { getCurrentUserId } from "@/lib/utils/auth";
import { FeedbackHeader } from "./components/FeedbackHeader";
import { TripInfoCard } from "./components/TripInfoCard";
import { RatingCard } from "./components/RatingCard";
import { CategoryCard } from "./components/CategoryCard";
import { CommentCard } from "./components/CommentCard";
import { ImageUploadCard } from "./components/ImageUploadCard";
import { SuccessScreen } from "./components/SuccessScreen";
import { LoadingState } from "./components/LoadingState";

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripData, setTripData] = useState<TripDto | undefined>();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize URL params
  const { tripId, seats, userId } = useMemo(() => ({
    tripId: searchParams.get("tripId"),
    seats: searchParams.get("seats")?.split(",") || ["1A", "1B"],
    userId: getCurrentUserId() || "current-user",
  }), [searchParams]);

  // Load trip data with caching
  const loadTrip = useCallback(async () => {
    if (!tripId) return;
    
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const trip = await getTripById(tripId);
      setTripData(trip);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Failed to load trip data:", err);
        setError("Không thể tải thông tin chuyến đi");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  // Memoized trip info
  const tripInfo = useMemo(() => {
    if (tripData) {
      return {
        trainNumber: tripData.train?.name || "N/A",
        route: `${tripData.originStation || "N/A"} → ${tripData.destinationStation || "N/A"}`,
        date: tripData.departure
          ? new Date(tripData.departure).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
        seats,
      };
    }
    return {
      trainNumber: "SE3",
      route: "Hà Nội → Đà Nẵng",
      date: "30/09/2025, 06:00",
      seats,
    };
  }, [tripData, seats]);

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - uploadedImages.length);
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  }, [uploadedImages.length]);

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Submit feedback
  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const feedbackData: FeedbackEntity = {
        id: "",
        userId,
        tripId: tripData?.id || tripId || "fallback-trip-id",
        rating,
        content: JSON.stringify({
          categories: Array.from(selectedCategories),
          comment: comment.trim() || undefined,
        }),
        createdAt: new Date().toISOString(),
      };

      await submitFeedback(feedbackData);
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể gửi phản hồi. Vui lòng thử lại."
      );
      console.error("Failed to submit feedback:", err);
    } finally {
      setIsLoading(false);
    }
  }, [comment, rating, selectedCategories, tripData, tripId, userId]);

  const handleSkip = () => router.push("/");
  const handleGoHome = () => router.push("/");
  const handleViewTickets = () => router.push("/my-tickets");

  if (loading) return <LoadingState />;

  if (isSubmitted) {
    return (
      <SuccessScreen
        rating={rating}
        onGoHome={handleGoHome}
        onViewTickets={handleViewTickets}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-primary/5">
      <FeedbackHeader />

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-3xl space-y-3">
          {/* Error Display */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/10">
              <div className="p-2">
                <p className="text-destructive">{error}</p>
              </div>
            </Card>
          )}

          <TripInfoCard tripInfo={tripInfo} />

          <RatingCard rating={rating} onRatingChange={setRating} />

          <CategoryCard
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
          />

          <CommentCard comment={comment} onCommentChange={setComment} />

          <ImageUploadCard
            uploadedImages={uploadedImages}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
          />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pb-5">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1 border-border hover:bg-card"
            >
              Bỏ qua
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={rating === 0 || isLoading}
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/90 disabled:from-gray-400 disabled:to-gray-500"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Star className="h-5 w-5" />
              )}
              {isLoading ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
