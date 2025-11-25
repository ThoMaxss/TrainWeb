import { apiFetch } from './config';
import { TrainDto } from '@/types';

// Train endpoints based on backend documentation

// GET /api/Train - Get all trains
export async function getAllTrains(): Promise<TrainDto[]> {
  return apiFetch<TrainDto[]>('/Train');
}

// GET /api/Train/{id} - Get train by ID
export async function getTrainById(id: string): Promise<TrainDto> {
  return apiFetch<TrainDto>(`/Train/${id}`);
}

// POST /api/Train - Create train
export async function createTrain(trainData: TrainDto): Promise<TrainDto> {
  return apiFetch<TrainDto>('/Train', {
    method: 'POST',
    body: JSON.stringify(trainData),
  });
}

// PUT /api/Train/{id} - Update train
export async function updateTrain(id: string, trainData: TrainDto): Promise<TrainDto> {
  return apiFetch<TrainDto>(`/Train/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trainData),
  });
}

// DELETE /api/Train/{id} - Delete train
export async function deleteTrain(id: string): Promise<void> {
  return apiFetch<void>(`/Train/${id}`, {
    method: 'DELETE',
  });
}
