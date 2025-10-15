// Feedback types for trip reviews

export interface FeedbackDto {
  id?: string;
  userId?: string;
  tripId?: string;
  rating: number;
  categories: string[];
  comment?: string;
  createdAt?: string;
}

// Full Feedback entity (all required)
export interface Feedback {
  id: string;
  userId: string;
  tripId: string;
  rating: number;
  categories: string[];
  comment?: string;
  createdAt: string;
}

// Create feedback request
export interface CreateFeedbackRequest {
  tripId: string;
  rating: number;
  categories: string[];
  comment?: string;
}
