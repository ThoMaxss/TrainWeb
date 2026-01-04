export interface TrainEntity {
  id: string;
  name: string;
  type: string;
}

export interface TrainDto {
  id?: string;
  name?: string;
  type?: string;
}

export const VIETNAM_TRAIN_STATIONS = [
  'Ga Hà Nội',
  'Ga Sài Gòn',
  'Ga Đà Nẵng',
  'Ga Huế',
  'Ga Nha Trang',
  'Ga Vinh',
  'Ga Đồng Hới',
  'Ga Quảng Ngãi',
  'Ga Biên Hòa',
  'Ga Phan Thiết',
  'Ga Lào Cai',
  'Ga Ninh Bình',
  'Ga Nam Định',
  'Ga Hải Phòng'
] as const;

export type TrainStation = typeof VIETNAM_TRAIN_STATIONS[number];
