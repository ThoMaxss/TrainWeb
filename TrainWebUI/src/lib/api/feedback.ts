import { API_CONFIG } from './config';
import type { FeedbackDto, Feedback } from '@/types';

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_ROOT}`;

export async function submitFeedback(feedbackData: FeedbackDto): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit feedback: ${response.statusText}`);
  }

  return response.json();
}

export async function getFeedbackByUserId(userId: string): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE_URL}/feedback/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feedback: ${response.statusText}`);
  }

  return response.json();
}

export async function getFeedbackByTripId(tripId: string): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE_URL}/feedback/trip/${tripId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feedback: ${response.statusText}`);
  }

  return response.json();
}
