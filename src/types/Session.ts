export interface Session {
    id: number;
    token: string;
    userId: number;
    expiresAt: Date;
  }