export interface MatrixPoint {
  key: string;
  label: string;
  value: number; // 1-22
}

export interface MatrixResult {
  points: MatrixPoint[];
  centerValue: number;
}
