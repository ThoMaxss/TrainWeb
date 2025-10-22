export interface MapRoute {
  type: string;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  properties: {
    distance: number;
    duration: number;
  };
}
