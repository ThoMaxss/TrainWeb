"use client";

import { useState, useEffect } from "react";
import { TripDto } from "@/types";
import { getAllTrips } from "@/lib/api/trip";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterBar } from "./components/FilterBar";
import { ScheduleList } from "./components/ScheduleList";
import { RouteMap } from "./components/RouteMap";
import { Calendar, Train, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TrainSchedulePage() {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripDto | null>(null);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
  const data = await getAllTrips();
  // No isActive in backend TripDto; use as-is
  setTrips(data);
  setFilteredTrips(data);
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: {
    originStation: string;
    destinationStation: string;
    date: string;
    timeRange: string;
  }) => {
    let filtered = [...trips];

    // Filter by departure station
    if (filters.originStation) {
      filtered = filtered.filter(
        (trip) => trip.originStation === filters.originStation
      );
    }

    // Filter by arrival station
    if (filters.destinationStation) {
      filtered = filtered.filter(
        (trip) => trip.destinationStation === filters.destinationStation
      );
    }

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter((trip) => {
        if (!trip.departure) return false;
        const tripDate = new Date(trip.departure).toDateString();
        const filterDate = new Date(filters.date).toDateString();
        return tripDate === filterDate;
      });
    }

    // Filter by time range
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

    setFilteredTrips(filtered);
  };

  const handleViewRoute = (trip: TripDto) => {
    setSelectedTrip(trip);
    setMapDialogOpen(true);
  };

  // Count unique routes
  const uniqueRoutes = new Set(
    trips.map((trip) => `${trip.originStation}-${trip.destinationStation}`)
  ).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Lịch trình tàu"
            description="Tra cứu lịch trình, xem bản đồ tuyến đường và đặt vé tàu dễ dàng"
            icon={Calendar}
            stats={[
              { icon: Train, label: "Chuyến tàu", value: trips.length },
              { icon: MapPin, label: "Tuyến đường", value: uniqueRoutes },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Kết quả tìm kiếm
              </h2>
              <p className="text-muted-foreground">
                Tìm thấy {filteredTrips.length} chuyến tàu
              </p>
            </div>
            <ScheduleList
              trips={filteredTrips}
              loading={loading}
              onViewRoute={handleViewRoute}
            />
          </div>

          {/* Route Map Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-16">
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
