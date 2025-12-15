"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth/AuthContext"
import { getTripById } from "@/lib/api/trip"
import { getSeatsByTripId } from "@/lib/api/seat"
import { createTicket } from "@/lib/api/ticket"
import { getAllTicketTypes } from "@/lib/api/ticketType"
import { createBooking } from "@/lib/api/booking"
import { SeatType, BookingStatus, TicketStatus, type TripDto, type BookingDto, type TicketEntity } from "@/types"
import { SEAT_TYPE_LABELS } from "@/types/seat"

type PassengerFormData = {
	fullName: string
	dateOfBirth: string
	gender: "male" | "female"
	idNumber: string
	phone: string
	email: string
}

interface SelectedSeat {
	id: string
	seatNumber: string
	price: number
	seatType: string
}

export default function BookingConfirmPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user, isLoading: authLoading } = useAuth()

	const tripId = searchParams.get("tripId") || ""
	const seatIdsParam = searchParams.get("seatIds") || ""
	const seatIds = useMemo(() => seatIdsParam.split(",").filter(Boolean), [seatIdsParam])

	const [tripData, setTripData] = useState<TripDto | undefined>()
	const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([])
	const [passengers, setPassengers] = useState<PassengerFormData[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)

	const seatIdsKey = useMemo(() => seatIds.join(","), [seatIds])

	useEffect(() => {
		let mounted = true
		async function load() {
			try {
				setLoading(true)
				if (!tripId) throw new Error("Thiếu tripId")
				const [trip, allSeats] = await Promise.all([
					getTripById(tripId),
					getSeatsByTripId(tripId),
				])
				if (!mounted) return
				setTripData(trip)
				const seatsMap = new Map(allSeats?.map(s => [s.id, s]) || [])
				const actualSeats: SelectedSeat[] = seatIds
					.map(id => {
						const s = seatsMap.get(id)
						if (!s) return null
						const typeLabel = (() => {
							if (s.type == null) return SEAT_TYPE_LABELS[SeatType.Soft]
							if (typeof s.type === "string") {
								const t = s.type.toLowerCase()
								return t === "soft" ? SEAT_TYPE_LABELS[SeatType.Soft] : SEAT_TYPE_LABELS[SeatType.Hard]
							}
							  return SEAT_TYPE_LABELS[s.type as SeatType]
						})()
						return {
							id: s.id!,
							seatNumber: s.seatNumber || "",
							price: s.price || 0,
							seatType: typeLabel,
						}
					})
					.filter((x): x is SelectedSeat => x !== null)

				if (actualSeats.length === 0) throw new Error("Không tìm thấy ghế hợp lệ")
				setSelectedSeats(actualSeats)
				setPassengers(actualSeats.map(() => ({
					fullName: "",
					dateOfBirth: "",
					gender: "male",
					idNumber: "",
					phone: "",
					email: "",
				})))
			} catch (e) {
				console.error(e)
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => { mounted = false }
	}, [tripId, seatIdsKey])

	function validateForm() {
		return passengers.every(p => p.fullName.trim().length > 0)
	}

	async function handleContinue() {
		if (authLoading) return alert("Đang kiểm tra đăng nhập…")
		if (!user?.id) {
			// Persist and redirect to login
			sessionStorage.setItem('pendingBooking', JSON.stringify({ tripId, seatIds, passengers }))
			router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname + window.location.search))
			return
		}
		if (!validateForm()) return alert("Vui lòng nhập họ tên hành khách")

		try {
			setSubmitting(true)
			if (!tripData) throw new Error("Thiếu dữ liệu chuyến đi")

			// 1) Lấy ticket type (dùng default nếu BE chưa có)
			let ticketTypes = [] as any[]
			try {
				ticketTypes = await getAllTicketTypes()
			} catch {}
			const defaultTicketType = ticketTypes[0] || { id: 'default', name: 'Standard', discount: 0 }

			// 2) Tạo Ticket cho từng ghế
			const tickets = await Promise.all(selectedSeats.map(seat => {
				const payload: Partial<TicketEntity> = {
					seat: {
						id: seat.id,
						seatNumber: seat.seatNumber,
						type: seat.seatType === SEAT_TYPE_LABELS[SeatType.Soft] ? SeatType.Soft : SeatType.Hard,
						price: seat.price,
					},
					ticketType: {
						id: defaultTicketType.id,
						name: defaultTicketType.name,
						discount: defaultTicketType.discount,
					},
					status: TicketStatus.Active,
				}
				return createTicket(payload as TicketEntity)
			}))

			// 3) Tạo Booking tham chiếu ticket.id
			const bookings = await Promise.all(tickets.map((t, idx) => {
				if (!t?.id) throw new Error("Tạo vé thất bại")
				const p = passengers[idx]
				const bookingData: BookingDto = {
					user: { id: user.id!, name: p.fullName.trim(), email: p.email?.trim() },
					ticket: { id: t.id, status: t.status ?? TicketStatus.Active },
					status: BookingStatus.Reserved,
					createdAt: new Date().toISOString(),
				}
				return createBooking(bookingData)
			}))

			const bookingIds = bookings.filter(b => b?.id).map(b => b!.id!)
			if (bookingIds.length === 0) {
				// Fallback demo IDs
				const demoIds = selectedSeats.map(() => `demo-${Date.now()}-${Math.random().toString(36).slice(2,7)}`)
				sessionStorage.setItem('pendingBooking', JSON.stringify({ seats: selectedSeats, tripId: tripData.id, passengers }))
				router.push(`/booking/payment?bookingId=${demoIds.join(',')}`)
				return
			}

			sessionStorage.setItem('pendingBooking', JSON.stringify({ bookingIds, seats: selectedSeats, tripId: tripData.id }))
			router.push(`/booking/payment?bookingId=${bookingIds.join(',')}`)
		} catch (e) {
			console.error(e)
			alert("Không thể tạo đơn đặt vé, vui lòng thử lại")
		} finally {
			setSubmitting(false)
		}
	}

	if (loading || authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="p-6">Đang tải…</Card>
			</div>
		)
	}

	if (!tripData || selectedSeats.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="p-6">Không có dữ liệu đơn hàng</Card>
			</div>
		)
	}

	const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0)

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-5xl mx-auto p-4 md:p-6">
				<h1 className="text-2xl font-semibold mb-2">Xác nhận thông tin hành khách</h1>
				<p className="text-muted-foreground mb-6">Chuyến đi: {tripData.originStation ?? "—"} → {tripData.destinationStation ?? "—"}</p>

				<Card className="p-4 mb-6">
					<h2 className="font-medium mb-3">Ghế đã chọn</h2>
					<div className="space-y-2">
						{selectedSeats.map((s, idx) => (
							<div key={s.id} className="flex items-center justify-between">
								<div>
									<span className="font-medium">Ghế {s.seatNumber}</span>
									<span className="text-muted-foreground ml-2">{s.seatType}</span>
								</div>
								<div className="font-medium">{s.price.toLocaleString()}₫</div>
							</div>
						))}
					</div>
					<Separator className="my-3" />
					<div className="flex items-center justify-between">
						<span className="font-medium">Tổng cộng</span>
						<span className="font-semibold">{totalPrice.toLocaleString()}₫</span>
					</div>
				</Card>

				<Card className="p-4 mb-6">
					<h2 className="font-medium mb-3">Thông tin hành khách</h2>
					<div className="space-y-3">
						{passengers.map((p, idx) => (
							<div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<input
									className="border rounded px-3 py-2"
									placeholder="Họ và tên"
									value={p.fullName}
									onChange={e => {
										const next = [...passengers]; next[idx] = { ...p, fullName: e.target.value }; setPassengers(next)
									}}
								/>
								<input
									className="border rounded px-3 py-2"
									placeholder="Số điện thoại"
									value={p.phone}
									onChange={e => { const next = [...passengers]; next[idx] = { ...p, phone: e.target.value }; setPassengers(next) }}
								/>
								<input
									className="border rounded px-3 py-2"
									placeholder="Email (tuỳ chọn)"
									value={p.email}
									onChange={e => { const next = [...passengers]; next[idx] = { ...p, email: e.target.value }; setPassengers(next) }}
								/>
							</div>
						))}
					</div>
				</Card>

				<div className="flex gap-3">
					<Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
					<Button onClick={handleContinue} disabled={submitting}>{submitting ? "Đang xử lý…" : "Tiếp tục thanh toán"}</Button>
				</div>
			</div>
		</div>
	)
}
