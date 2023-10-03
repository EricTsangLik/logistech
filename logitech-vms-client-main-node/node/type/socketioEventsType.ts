export interface ServerToClientEvents {
  packageData: (length: number, width: number, height: number, weight: number) => void;
  lengthData: (data: object) => void;
  widthData: (data: object) => void;
  heightData: (data: object) => void;
  weightData: (data: object) => void;
  healthCheck: (data: object) => void;
  imgData: (data: Array<number>) => void;
  pointCloudData: (data: string) => void;
  horizontalData: (data: Array<Array<number>>) => void;
  verticalData: (data: Array<number>) => void;
}

export interface ClientToServerEvents {
  lengthData: (data: object) => void;
  widthData: (data: object) => void;
  heightData: (data: object) => void;
  weightData: (data: object) => void;
  healthCheck: (data: object) => void;
  imgData: (data: Array<number>) => void;
  pointCloudData: (data: string) => void;
  horizontalData: (data: Array<Array<number>>) => void;
  verticalData: (data: Array<number>) => void;
}

/*
export interface InterServerEvents {
  ping: () => void;
}

*/
export interface SocketData {
  deviceId: string;
}