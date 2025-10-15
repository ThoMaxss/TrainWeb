"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Star,
  Train,
  Calendar,
  Users,
  Armchair,
  UserCheck,
  Clock,
  DollarSign,
  Smartphone,
  Upload,
  X,
  CheckCircle,
  Home,
  Ticket,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import { getTripById } from "@/lib/api/trip";
import { submitFeedback } from "@/lib/api/feedback";
import type { TripDto, FeedbackDto } from "@/types";

interface FeedbackCategory {
  id: string;
  label: string;
  icon: any;
}

const categories: FeedbackCategory[] = [
  { id: "train", label: "Tàu & tiện nghi", icon: Train },
  { id: "seat", label: "Ghế ngồi", icon: Armchair },
  { id: "staff", label: "Nhân viên phục vụ", icon: UserCheck },
  { id: "punctuality", label: "Đúng giờ", icon: Clock },
  { id: "price", label: "Giá vé", icon: DollarSign },
  { id: "app", label: "Ứng dụng đặt vé", icon: Smartphone },
];

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripData, setTripData] = useState<TripDto | undefined>();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tripId = searchParams.get("tripId");
  const seats = searchParams.get("seats")?.split(",") || ["1A", "1B"];
  const userId = "current-user"; // TODO: get from auth context

  useEffect(() => {
    if (tripId) {
      let mounted = true;
      async function loadTrip() {
        try {
          setLoading(true);
          const trip = await getTripById(tripId!);
          if (mounted) {
            setTripData(trip);
          }
        } catch (error) {
          console.error("Failed to load trip data:", error);
          // Continue with fallback data
        } finally {
          if (mounted) setLoading(false);
        }
      }
      loadTrip();
      return () => { mounted = false; };
    }
  }, [tripId]);

  // Default trip info fallback
  const tripInfo = tripData ? {
    trainNumber: tripData.train?.name || "N/A",
    route: `${tripData.originStation || "N/A"} → ${tripData.destinationStation || "N/A"}`,
    date: tripData.departure ? new Date(tripData.departure).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }) : "N/A",
    seats,
  } : {
    trainNumber: "SE3",
    route: "Hà Nội → Đà Nẵng", 
    date: "30/09/2025, 06:00",
    seats,
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - uploadedImages.length);
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  // Remove uploaded image
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit feedback
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const feedbackData: FeedbackDto = {
        userId,
        tripId: tripData?.id || "fallback-trip-id",
        rating,
        categories: Array.from(selectedCategories),
        comment: comment.trim() || undefined,
      };

      await submitFeedback(feedbackData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi phản hồi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Skip feedback
  const handleSkip = () => {
    router.push("/");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewTickets = () => {
    router.push("/my-tickets");
  };

  // Get emoji for rating
  const getEmojiForRating = (stars: number) => {
    if (stars <= 2) return { icon: Frown, color: "text-error", label: "Không hài lòng" };
    if (stars <= 3) return { icon: Meh, color: "text-warning", label: "Bình thường" };
    return { icon: Smile, color: "text-success", label: "Hài lòng" };
  };

  const emojiRating = rating > 0 ? getEmojiForRating(rating) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-2 py-16">
          <div className="mx-auto max-w-2xl">
            <Card className="border-0 bg-background shadow-xl">
              <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
                {/* Success Icon */}
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 animate-bounce-once">
                  <CheckCircle className="h-12 w-12 text-primary-foreground" />
                </div>

                {/* Thank You Message */}
                <h1 className="mb-3 bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-2xl font-bold">
                  Cảm ơn bạn đã gửi phản hồi!
                </h1>
                <p className="mb-2 max-w-md text-muted-foreground">
                  Ý kiến của bạn rất quan trọng với chúng tôi. Chúng tôi sẽ cải
                  thiện dịch vụ để phục vụ bạn tốt hơn.
                </p>

                {/* Rating Display */}
                {rating > 0 && (
                  <div className="mb-5 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-6 w-6",
                            star <= rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    {emojiRating && (
                      <>
                        <Separator orientation="vertical" className="h-6" />
                        <emojiRating.icon className={cn("h-6 w-6", emojiRating.color)} />
                        <span className="text-sm text-muted-foreground">
                          {emojiRating.label}
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <Button
                    size="lg"
                    onClick={handleGoHome}
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <Home className="h-5 w-5" />
                    Quay lại trang chủ
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleViewTickets}
                    className="flex-1 gap-2 border-primary hover:bg-primary/10"
                  >
                    <Ticket className="h-5 w-5" />
                    Xem vé của tôi
                  </Button>
                </div>

                {/* Additional Info */}
                <p className="mt-5 text-xs text-muted-foreground">
                  Bạn sẽ nhận được phản hồi từ chúng tôi qua email trong vòng 24 giờ
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Add bounce animation */}
        <style>{`
          @keyframes bounce-once {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(0.9); }
            50% { transform: scale(1.1); }
            75% { transform: scale(0.95); }
          }
          .animate-bounce-once {
            animation: bounce-once 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Main feedback form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-background shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Đánh giá chuyến đi</h1>
                <p className="text-sm text-muted-foreground">
                  Chia sẻ trải nghiệm của bạn để chúng tôi phục vụ tốt hơn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-3xl space-y-3">
          {/* Error Display */}
          {error && (
            <Card className="border-destructive/20 bg-error/10">
              <div className="p-2">
                <p className="text-error">{error}</p>
              </div>
            </Card>
          )}

          {/* Trip Summary Card */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Thông tin chuyến đi</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Train className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tàu số</p>
                    <p className="font-mono font-medium">{tripInfo.trainNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày khởi hành</p>
                    <p className="font-medium">{tripInfo.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hành trình</p>
                    <p className="font-medium">{tripInfo.route}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Armchair className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chỗ ngồi</p>
                    <div className="flex gap-1">
                      {tripInfo.seats.map((seat, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-primary text-xs"
                        >
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Rating Section */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <Label className="mb-3 block text-lg font-semibold text-foreground">
                Bạn đánh giá chuyến đi này thế nào?
              </Label>

              {/* Star Rating */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="group transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={cn(
                          "h-10 w-10 transition-colors sm:h-12 sm:w-12",
                          star <= (hoveredRating || rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground group-hover:text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating Label with Emoji */}
                {rating > 0 && (
                  <div className="flex items-center gap-2 animate-fade-in">
                    {emojiRating && (
                      <>
                        <emojiRating.icon className={cn("h-8 w-8", emojiRating.color)} />
                        <p className="text-lg text-muted-foreground">
                          {emojiRating.label}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Feedback Categories */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <Label className="mb-3 block text-lg font-semibold text-foreground">
                Bạn muốn đánh giá về điểm nào? (chọn nhiều)
              </Label>

              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((category) => {
                  const CategoryIcon = category.icon;
                  const isSelected = selectedCategories.has(category.id);

                  return (
                    <div
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary hover:bg-card"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="pointer-events-none"
                      />
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                          isSelected ? "bg-primary/10" : "bg-card"
                        )}
                      >
                        <CategoryIcon
                          className={cn(
                            "h-5 w-5",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {category.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Comment Section */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <Label htmlFor="comment" className="mb-2 block text-lg font-semibold text-foreground">
                Nhập ý kiến của bạn{" "}
                <span className="text-muted-foreground font-normal">(tùy chọn)</span>
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ điều bạn hài lòng hoặc muốn cải thiện…"
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Tối đa 500 ký tự</span>
                <span>{comment.length}/500</span>
              </div>
            </div>
          </Card>

          {/* Image Upload */}
          <Card className="border-0 bg-background shadow-md">
            <div className="p-2">
              <Label className="mb-3 block text-lg font-semibold text-foreground">
                Thêm hình ảnh{" "}
                <span className="text-muted-foreground font-normal">(tùy chọn, tối đa 3 ảnh)</span>
              </Label>

              <div className="space-y-3">
                {/* Upload Button */}
                {uploadedImages.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-2 transition-colors hover:border-primary hover:bg-primary/10"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Chọn ảnh từ thiết bị</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg border bg-card"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-error text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs text-primary-foreground truncate">
                            {image.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

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
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500"
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

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
