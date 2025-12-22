// Export all API functions
export * from "./config";
export * from "./auth";
export * from "./user";
export * from "./train";
export * from "./trip";
export * from "./booking";
export * from "./payment";
export * from "./feedback";
export * from "./ticket";

// ✅ Re-export types (updated)
// User types chuẩn mới (role string + profile/me/admin requests)
export type {
  UserRole,
  UserProfile,
  MeResponse,
  UpdateMeRequest,
  AdminUpdateUserRequest,
  AdminCreateUserRequest,
  AuthResponse,
  LoginRequest,
} from "@/types/user";

// ✅ Keep other domain DTOs as before
export type {
  TrainDto,
  TripDto,
  SeatDto,
  BookingDto,
  PaymentEntity,
  PaymentRequest,
  PassengerDto,
} from "@/types";

// ✅ Re-export enums (but DO NOT export UserRole here anymore)
// vì UserRole giờ là type string union, không phải enum runtime
export {
  SeatType,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  TicketStatus,
} from "@/types";
