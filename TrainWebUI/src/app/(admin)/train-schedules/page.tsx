"use client";

import { useState, useEffect } from "react";
import { TripDto } from "@/types";
import { getAllTrips, createTrip, updateTrip, deleteTrip } from "@/lib/api/trip";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ScheduleStats } from "./components/ScheduleStats";
import { ScheduleFilters } from "./components/ScheduleFilters";
import { ScheduleTable } from "./components/ScheduleTable";
import { ScheduleForm } from "./components/ScheduleForm";
import { RoutePreview } from "./components/RoutePreview";
import { DeleteDialog } from "./components/DeleteDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Calendar, Plus } from "lucide-react";

export default function AdminTrainSchedulesPage() {
  const { show } = useToast();
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<TripDto | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStation, setFilterStation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trips, searchQuery, filterStation, filterStatus]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await getAllTrips();
      setTrips(data);
      setFilteredTrips(data);
    } catch (error) {
      console.error("Failed to load trips:", error);
      show("Không thể tải danh sách lịch trình");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.train?.name?.toLowerCase().includes(q) ||
          trip.train?.type?.toLowerCase?.().includes(q) ||
          trip.originStation?.toLowerCase().includes(q) ||
          trip.destinationStation?.toLowerCase().includes(q)
      );
    }

    // Station filter
    if (filterStation !== "all") {
      filtered = filtered.filter(
        (trip) =>
          trip.originStation === filterStation ||
          trip.destinationStation === filterStation
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "active") {
        filtered = filtered.filter((trip) => (trip.seatsAvailable ?? 0) > 0);
      } else {
        filtered = filtered.filter((trip) => (trip.seatsAvailable ?? 0) <= 0);
      }
    }

    setFilteredTrips(filtered);
  };

  const handleCreateNew = () => {
    setSelectedTrip(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (trip: TripDto) => {
    setSelectedTrip(trip);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (trip: TripDto) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      if (!tripToDelete.id) throw new Error('Missing trip id');
      await deleteTrip(tripToDelete.id);
      show("Đã xóa lịch trình thành công!");
      await loadTrips();
      setDeleteDialogOpen(false);
      setTripToDelete(null);
      if (selectedTrip?.id === tripToDelete.id) {
        setSelectedTrip(null);
      }
    } catch (error) {
      console.error("Failed to delete trip:", error);
      show("Không thể xóa lịch trình");
    }
  };

  const handleSave = async (tripData: Partial<TripDto>) => {
    try {
      if (formMode === "create") {
        await createTrip(tripData as TripDto);
        show("Đã tạo lịch trình mới thành công!");
      } else if (selectedTrip) {
        if (!selectedTrip.id) throw new Error('Missing trip id');
        await updateTrip(selectedTrip.id, tripData as TripDto);
        show("Đã cập nhật lịch trình thành công!");
      }
      await loadTrips();
      setFormOpen(false);
    } catch (error) {
      console.error("Failed to save trip:", error);
      show("Không thể lưu lịch trình");
      throw error;
    }
  };

  const handleViewRoute = (trip: TripDto) => {
    setSelectedTrip(trip);
  };

  // Get unique stations
  const uniqueStations: string[] = Array.from(
    new Set(
      trips
        .flatMap((trip) => [trip.originStation, trip.destinationStation])
        .filter((station): station is string => station !== undefined && station.trim() !== "")
    )
  ).sort();

  // Calculate stats
  const totalSchedules = trips.length;
  const activeSchedules = trips.filter((t) => (t.seatsAvailable ?? 0) > 0).length;
  const uniqueRoutes = Array.from(
    new Set(
      trips.map((t) => `${t.originStation}-${t.destinationStation}`)
    )
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải danh sách lịch trình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title="Quản lý lịch trình tàu"
        description={`${totalSchedules} lịch trình trong hệ thống`}
        icon={Calendar}
        actions={
          <Button onClick={handleCreateNew} className="gap-2 h-10">
            <Plus className="h-4 w-4" />
            Tạo lịch trình
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
        <ScheduleStats
          totalSchedules={totalSchedules}
          activeSchedules={activeSchedules}
          uniqueRoutes={uniqueRoutes}
        />

        <ScheduleFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStation={filterStation}
          setFilterStation={setFilterStation}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          uniqueStations={uniqueStations}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScheduleTable
              trips={filteredTrips}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewRoute={handleViewRoute}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <RoutePreview trip={selectedTrip} />
            </div>
          </div>
        </div>
      </div>

      <ScheduleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        trip={selectedTrip}
        onSave={handleSave}
        mode={formMode}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        trip={tripToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
