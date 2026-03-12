export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  iat?: number;
  exp?: number;
  sessionId?: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user: JwtPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      deviceFingerprint?: string;
      requestId?: string;
    }
  }
}
