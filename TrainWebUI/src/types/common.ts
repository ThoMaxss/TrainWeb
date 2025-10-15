// Common enums
export enum UserRole {
  PASSENGER = 'Passenger',
  STAFF = 'Staff', 
  ADMIN = 'Admin'
}

export enum SeatType {
  HARD = 'Hard',
  SOFT = 'Soft'
}

export enum BookingStatus {
  RESERVED = 'Reserved',
  PAID = 'Paid',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success', // For backward compatibility with old API
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

export enum PaymentMethod {
  VISA = 'Visa', // For backward compatibility with old API
  VNPAY = 'VNPay',
  MOMO = 'MoMo',
  CASH = 'Cash'
}

// Gender enum for passenger info
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}
