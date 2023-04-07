export interface App {
  protocol: string,
  host: string,
  port: number,
  name: string,
}

export interface Log {
  app: {
      level?: string,
      directoryMount?: string,
      subDirectory?: string,
      filePrefix?: string,
      errorFilePrefix?: string,
      dateParttern?: string,
      maxSize?: string,
      maxFile?: string,
      zippedArchive?: boolean,
  }
}