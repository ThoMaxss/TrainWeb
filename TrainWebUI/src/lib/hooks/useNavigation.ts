"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for centralized navigation management
 * Provides type-safe navigation methods for all routes in the application
 */
export function useNavigation() {
  const router = useRouter();

  // ===== PUBLIC/HOME ROUTES =====
  const goHome = useCallback(() => {
    router.push("/");
  }, [router]);

  // ===== AUTH ROUTES =====
  const goToLogin = useCallback((returnUrl?: string) => {
    const url = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login";
    router.push(url);
  }, [router]);

  const goToRegister = useCallback((returnUrl?: string) => {
    const url = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : "/register";
    router.push(url);
  }, [router]);

  // ===== USER ROUTES =====
  
  // Search & Browse
  const goToSearch = useCallback((params?: {
    from?: string;
    to?: string;
    date?: string;
    passengers?: number;
  }) => {
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.from) searchParams.set("from", params.from);
      if (params.to) searchParams.set("to", params.to);
      if (params.date) searchParams.set("date", params.date);
      if (params.passengers) searchParams.set("passengers", params.passengers.toString());
      router.push(`/search?${searchParams.toString()}`);
    } else {
      router.push("/search");
    }
  }, [router]);

  const goToTrainDetail = useCallback((trainId: string, params?: {
    tripId?: string;
    seatType?: string;
    from?: string;
    to?: string;
    date?: string;
  }) => {
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.tripId) searchParams.set("tripId", params.tripId);
      if (params.seatType) searchParams.set("seatType", params.seatType);
      if (params.from) searchParams.set("from", params.from);
      if (params.to) searchParams.set("to", params.to);
      if (params.date) searchParams.set("date", params.date);
      router.push(`/train/${trainId}?${searchParams.toString()}`);
    } else {
      router.push(`/train/${trainId}`);
    }
  }, [router]);

  // Booking Flow
  const goToBooking = useCallback((trainId: string, params?: {
    tripId?: string;
    seatType?: string;
  }) => {
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.tripId) searchParams.set("tripId", params.tripId);
      if (params.seatType) searchParams.set("seatType", params.seatType);
      router.push(`/booking/${trainId}?${searchParams.toString()}`);
    } else {
      router.push(`/booking/${trainId}`);
    }
  }, [router]);

  const goToBookingConfirm = useCallback((params: {
    tripId: string;
    seatIds: string;
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.set("tripId", params.tripId);
    searchParams.set("seatIds", params.seatIds);
    router.push(`/booking/confirm?${searchParams.toString()}`);
  }, [router]);

  const goToPayment = useCallback((bookingId: string) => {
    router.push(`/booking/payment?bookingId=${bookingId}`);
  }, [router]);

  const goToBookingSuccess = useCallback((params: {
    bookingId: string;
    paymentId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.set("bookingId", params.bookingId);
    if (params.paymentId) searchParams.set("paymentId", params.paymentId);
    router.push(`/booking/success?${searchParams.toString()}`);
  }, [router]);

  // User Profile & Management
  const goToProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const goToMyTickets = useCallback(() => {
    router.push("/my-tickets");
  }, [router]);

  const goToTicketDetail = useCallback((ticketId: string) => {
    router.push(`/my-tickets/${ticketId}`);
  }, [router]);

  const goToTransactions = useCallback(() => {
    router.push("/transactions");
  }, [router]);

  const goToNotifications = useCallback(() => {
    router.push("/notifications");
  }, [router]);

  const goToFeedback = useCallback((tripId?: string) => {
    const url = tripId ? `/feedback?tripId=${tripId}` : "/feedback";
    router.push(url);
  }, [router]);

  const goToTrainSchedule = useCallback(() => {
    router.push("/train-schedule");
  }, [router]);

  const goToSupport = useCallback(() => {
    router.push("/support");
  }, [router]);

  // ===== STAFF ROUTES =====
  const goToStaffDashboard = useCallback(() => {
    router.push("/staff-dashboard");
  }, [router]);

  const goToStaffProfile = useCallback(() => {
    router.push("/profile/staff");
  }, [router]);

  const goToCustomers = useCallback(() => {
    router.push("/customers");
  }, [router]);

  const goToManageTickets = useCallback(() => {
    router.push("/manage-tickets");
  }, [router]);

  const goToTicketManagementDetail = useCallback((ticketId: string) => {
    router.push(`/manage-tickets/${ticketId}`);
  }, [router]);

  const goToQRCheck = useCallback(() => {
    router.push("/qr-check");
  }, [router]);

  const goToRefunds = useCallback(() => {
    router.push("/feedback-management");
  }, [router]);

  const goToReports = useCallback((type?: "daily" | "revenue") => {
    if (type) {
      router.push(`/reports/${type}`);
    } else {
      router.push("/reports");
    }
  }, [router]);

  // ===== ADMIN ROUTES =====
  const goToAdminDashboard = useCallback(() => {
    router.push("/admin-dashboard");
  }, [router]);

  const goToAdminProfile = useCallback(() => {
    router.push("/profile/admin");
  }, [router]);

  const goToStaffManagement = useCallback(() => {
    router.push("/staff");
  }, [router]);

  const goToStaffDetail = useCallback((staffId: string) => {
    router.push(`/staff/${staffId}`);
  }, [router]);

  const goToTrainManagement = useCallback(() => {
    router.push("/trains");
  }, [router]);

  const goToTrainManagementDetail = useCallback((trainId: string) => {
    router.push(`/trains/${trainId}`);
  }, [router]);

  const goToNewTrain = useCallback(() => {
    router.push("/trains/new");
  }, [router]);

  const goToTicketTemplates = useCallback(() => {
    router.push("/tickets/templates");
  }, [router]);

  const goToAdminTrainSchedules = useCallback(() => {
    router.push("/train-schedules");
  }, [router]);

  // ===== NAVIGATION UTILITIES =====
  
  /**
   * Navigate back to previous page
   */
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Navigate forward in browser history
   */
  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  /**
   * Refresh the current page
   */
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  /**
   * Replace current URL without adding to history
   */
  const replace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  /**
   * Navigate to any custom path
   */
  const push = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  /**
   * Navigate with role-based routing
   */
  const goToDashboard = useCallback((role: "user" | "staff" | "admin") => {
    switch (role) {
      case "admin":
        goToAdminDashboard();
        break;
      case "staff":
        goToStaffDashboard();
        break;
      case "user":
      default:
        goHome();
        break;
    }
  }, [goToAdminDashboard, goToStaffDashboard, goHome]);

  /**
   * Navigate to profile based on role
   */
  const goToProfileByRole = useCallback((role: "user" | "staff" | "admin") => {
    switch (role) {
      case "admin":
        goToAdminProfile();
        break;
      case "staff":
        goToStaffProfile();
        break;
      case "user":
      default:
        goToProfile();
        break;
    }
  }, [goToAdminProfile, goToStaffProfile, goToProfile]);

  return {
    // Router instance (for advanced usage)
    router,

    // Public Routes
    goHome,
    
    // Auth Routes
    goToLogin,
    goToRegister,
    
    // User Routes
    goToSearch,
    goToTrainDetail,
    goToBooking,
    goToBookingConfirm,
    goToPayment,
    goToBookingSuccess,
    goToProfile,
    goToMyTickets,
    goToTicketDetail,
    goToTransactions,
    goToNotifications,
    goToFeedback,
    goToTrainSchedule,
    goToSupport,
    
    // Staff Routes
    goToStaffDashboard,
    goToStaffProfile,
    goToCustomers,
    goToManageTickets,
    goToTicketManagementDetail,
    goToQRCheck,
    goToRefunds,
    goToReports,
    
    // Admin Routes
    goToAdminDashboard,
    goToAdminProfile,
    goToStaffManagement,
    goToStaffDetail,
    goToTrainManagement,
    goToTrainManagementDetail,
    goToNewTrain,
    goToTicketTemplates,
    goToAdminTrainSchedules,
    
    // Navigation Utilities
    goBack,
    goForward,
    refresh,
    replace,
    push,
    
    // Role-based Navigation
    goToDashboard,
    goToProfileByRole,
  };
}

/**
 * Type for the navigation object returned by useNavigation hook
 */
export type Navigation = ReturnType<typeof useNavigation>;
