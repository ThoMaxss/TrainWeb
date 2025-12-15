"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TripDto } from "@/types";
import { getAllTrips } from "@/lib/api/trip";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "./components/FilterBar";
import { ScheduleList } from "./components/ScheduleList";
import { RouteMap } from "./components/RouteMap";
import { Calendar, Train, MapPin, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const CACHE_KEY = 'train_schedule_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function TrainSchedulePage() {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripDto | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    originStation: "",
    destinationStation: "",
    date: "",
    timeRange: "all",
  });

  // Load trips with caching
  const loadTrips = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setTrips(data);
          setLoading(false);
          return;
        }
      }

      const data = await getAllTrips();
      setTrips(data || []);
      
      // Cache the result
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError("Không thể tải lịch trình tàu. Vui lòng thử lại.");
        console.error("Failed to load trips:", err);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Memoized filtered trips
  const filteredTrips = useMemo(() => {
    let filtered = [...trips];

    if (filters.originStation) {
      filtered = filtered.filter(
        (trip) => trip.originStation === filters.originStation
      );
    }

    if (filters.destinationStation) {
      filtered = filtered.filter(
        (trip) => trip.destinationStation === filters.destinationStation
      );
    }

    if (filters.date) {
      filtered = filtered.filter((trip) => {
        if (!trip.departure) return false;
        const tripDate = new Date(trip.departure).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        return tripDate === filterDate;
      });
    }

    if (filters.timeRange !== "all") {
      filtered = filtered.filter((trip) => {
        if (!trip.departure) return false;
        const hour = new Date(trip.departure).getHours();
        switch (filters.timeRange) {
          case "morning":
            return hour >= 0 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 && hour < 24;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [trips, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleViewRoute = useCallback((trip: TripDto) => {
    setSelectedTrip(trip);
    setMapDialogOpen(true);
  }, []);

  // Memoized stats
  const stats = useMemo(() => {
    const uniqueRoutes = new Set(
      trips.map((trip) => `${trip.originStation}-${trip.destinationStation}`)
    ).size;
    
    return {
      totalTrips: trips.length,
      uniqueRoutes,
    };
  }, [trips]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải lịch trình tàu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center rounded-2xl border">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={loadTrips}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <PageHeader
            title="Lịch trình tàu"
            description="Tra cứu lịch trình, xem bản đồ tuyến đường và đặt vé tàu dễ dàng"
            icon={Calendar}
            stats={[
              { icon: Train, label: "Chuyến tàu", value: stats.totalTrips },
              { icon: MapPin, label: "Tuyến đường", value: stats.uniqueRoutes },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Kết quả tìm kiếm
              </h2>
              <p className="text-muted-foreground">
                Tìm thấy {filteredTrips.length} chuyến tàu
              </p>
            </div>
            <ScheduleList
              trips={filteredTrips}
              loading={false}
              onViewRoute={handleViewRoute}
            />
          </div>

          {/* Route Map Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <RouteMap trip={selectedTrip} />
            </div>
          </div>
        </div>
      </div>

      {/* Route Map Dialog (Mobile) */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bản đồ tuyến đường</DialogTitle>
          </DialogHeader>
          <RouteMap trip={selectedTrip} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
