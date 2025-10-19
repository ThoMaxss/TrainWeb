import { apiFetch } from './config';
import { TrainDto } from '@/types';

// Train endpoints based on backend documentation

// GET /api/train - Get all trains
export async function getAllTrains(): Promise<TrainDto[]> {
  return apiFetch<TrainDto[]>('/train');
}

// GET /api/train/{id} - Get train by ID
export async function getTrainById(id: string): Promise<TrainDto> {
  return apiFetch<TrainDto>(`/train/${id}`);
}

// POST /api/train - Create train
export async function createTrain(trainData: TrainDto): Promise<TrainDto> {
  return apiFetch<TrainDto>('/train', {
    method: 'POST',
    body: JSON.stringify(trainData),
  });
}

// PUT /api/train/{id} - Update train
export async function updateTrain(id: string, trainData: TrainDto): Promise<TrainDto> {
  return apiFetch<TrainDto>(`/train/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trainData),
  });
}

// DELETE /api/train/{id} - Delete train
export async function deleteTrain(id: string): Promise<void> {
  return apiFetch<void>(`/train/${id}`, {
    method: 'DELETE',
  });
}
