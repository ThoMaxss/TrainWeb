"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/AuthContext"
import { getTripById } from "@/lib/api/trip"
import { getSeatsByTripId } from "@/lib/api/seat"
import { createTicket } from "@/lib/api/ticket"
import { getAllTicketTypes } from "@/lib/api/ticketType"
import { createBooking } from "@/lib/api/booking"
import { SeatType, BookingStatus, TicketStatus, type TripDto, type BookingDto, type TicketEntity } from "@/types"
import { SEAT_TYPE_LABELS } from "@/types/seat"
import { 
	Train, 
	Calendar, 
	Clock, 
	MapPin, 
	User, 
	Phone, 
	Mail, 
	CreditCard,
	AlertCircle,
	ArrowRight,
	Armchair
} from "lucide-react"

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
	const [error, setError] = useState<string | null>(null)

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
				const seatsMap = new Map(allSeats?.map((s: any) => [s.id, s]) || [])
				const actualSeats: SelectedSeat[] = seatIds
					.map((id: string) => {
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
					.filter((x: SelectedSeat | null): x is SelectedSeat => x !== null)

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
			setError(null)
			if (!tripData) throw new Error("Thiếu dữ liệu chuyến đi")

			// 1) Lấy ticket type (dùng default nếu BE chưa có)
			let ticketTypes = [] as any[]
			try {
				ticketTypes = await getAllTicketTypes()
			} catch {}
			const defaultTicketType = ticketTypes[0] || { id: 'default', name: 'Standard', discount: 0 }

			// 2) Tạo Ticket cho từng ghế
			const tickets = await Promise.all(selectedSeats.map(async seat => {
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
				try {
					return await createTicket(payload as TicketEntity)
				} catch (ticketErr) {
					console.error("Create ticket failed", ticketErr)
					throw new Error("Không thể tạo vé, vui lòng thử lại")
				}
			}))

			// 3) Tạo Booking tham chiếu ticket.id
			const bookings = await Promise.all(tickets.map(async (t, idx) => {
				if (!t?.id) throw new Error("Tạo vé thất bại")
				const p = passengers[idx]
				const bookingData: BookingDto = {
					user: { id: user.id!, name: p.fullName.trim(), email: p.email?.trim() },
					ticket: { id: t.id, status: t.status ?? TicketStatus.Active },
					status: BookingStatus.Reserved,
					createdAt: new Date().toISOString(),
				}
				
				// Optimistic UI: show success immediately
				setSubmitting(false)
				
				try {
					return await createBooking(bookingData)
				} catch (bookingErr: any) {
					console.error("Create booking failed", bookingErr)
					// Check if it's a seat already booked error from backend
					const errorMsg = bookingErr?.response?.data?.message || 
					                 bookingErr?.message || 
					                 "Không thể tạo đơn đặt vé"
					throw new Error(errorMsg)
				}
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
			const message = e instanceof Error ? e.message : "Không thể tạo đơn đặt vé, vui lòng thử lại"
			setError(message)
			setSubmitting(false) // Re-enable button on error
			alert(message)
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
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
			{/* Header Section */}
			<div className="bg-background border-b">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-2">Xác nhận đặt vé</h1>
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="h-4 w-4" />
								<span className="font-medium">{tripData.originStation ?? "—"}</span>
								<ArrowRight className="h-4 w-4" />
								<span className="font-medium">{tripData.destinationStation ?? "—"}</span>
							</div>
						</div>
						<Button variant="ghost" onClick={() => router.back()}>
							← Quay lại
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
				<div className="grid lg:grid-cols-3 gap-6">
					{/* Left Column - Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Error Alert */}
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Đặt vé thất bại</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* Trip Information Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Train className="h-5 w-5 text-primary" />
									Thông tin chuyến đi
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Ngày khởi hành</p>
											<p className="font-semibold">
												{tripData.departure ? new Date(tripData.departure).toLocaleDateString("vi-VN") : "—"}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Giờ khởi hành</p>
											<p className="font-semibold">
												{tripData.departure ? new Date(tripData.departure).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—"}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
									<Train className="h-5 w-5 text-primary" />
									<div>
										<p className="text-sm text-muted-foreground">Tàu</p>
										<p className="font-semibold">{tripData.train?.name ?? "—"}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Passenger Information Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="h-5 w-5 text-primary" />
									Thông tin hành khách
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{passengers.map((p, idx) => (
									<div key={idx} className="space-y-4 p-4 border rounded-lg bg-muted/20">
										<div className="flex items-center gap-2 mb-2">
											<Badge variant="secondary">Ghế {selectedSeats[idx]?.seatNumber}</Badge>
											<span className="text-sm text-muted-foreground">
												{selectedSeats[idx]?.seatType}
											</span>
										</div>
										<div className="grid gap-4">
											<div className="space-y-2">
												<Label htmlFor={`name-${idx}`} className="flex items-center gap-2">
													<User className="h-4 w-4" />
													Họ và tên <span className="text-destructive">*</span>
												</Label>
												<Input
													id={`name-${idx}`}
													placeholder="Nhập họ và tên"
													value={p.fullName}
													onChange={e => {
														const next = [...passengers]
														next[idx] = { ...p, fullName: e.target.value }
														setPassengers(next)
													}}
													className="border-2"
												/>
											</div>
											<div className="grid md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`phone-${idx}`} className="flex items-center gap-2">
														<Phone className="h-4 w-4" />
														Số điện thoại
													</Label>
													<Input
														id={`phone-${idx}`}
														placeholder="Nhập số điện thoại"
														value={p.phone}
														onChange={e => {
															const next = [...passengers]
															next[idx] = { ...p, phone: e.target.value }
															setPassengers(next)
														}}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`email-${idx}`} className="flex items-center gap-2">
														<Mail className="h-4 w-4" />
														Email (tùy chọn)
													</Label>
													<Input
														id={`email-${idx}`}
														type="email"
														placeholder="Nhập email"
														value={p.email}
														onChange={e => {
															const next = [...passengers]
															next[idx] = { ...p, email: e.target.value }
															setPassengers(next)
														}}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Summary */}
					<div className="lg:col-span-1">
						<div className="sticky top-6 space-y-6">
							{/* Selected Seats Card */}
							<Card className="border-2">
								<CardHeader className="bg-primary/5">
									<CardTitle className="flex items-center gap-2 text-lg">
										<Armchair className="h-5 w-5" />
										Ghế đã chọn
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6 space-y-3">
									{selectedSeats.map((s, idx) => (
										<div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
													<Armchair className="h-5 w-5 text-primary" />
												</div>
												<div>
													<p className="font-semibold">Ghế {s.seatNumber}</p>
													<p className="text-xs text-muted-foreground">{s.seatType}</p>
												</div>
											</div>
											<div className="text-right">
												<p className="font-semibold">{s.price.toLocaleString()}₫</p>
											</div>
										</div>
									))}
									<Separator className="my-4" />
									<div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
										<span className="font-semibold">Tổng cộng</span>
										<span className="text-xl font-bold text-primary">{totalPrice.toLocaleString()}₫</span>
									</div>
								</CardContent>
							</Card>

							{/* Payment Button */}
							<Button 
								className="w-full h-12 text-base gap-2" 
								onClick={handleContinue} 
								disabled={submitting}
								size="lg"
							>
								{submitting ? (
									<>
										<div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Đang xử lý...
									</>
								) : (
									<>
										<CreditCard className="h-5 w-5" />
										Tiếp tục thanh toán
									</>
								)}
							</Button>

							{/* Note */}
							<Card className="bg-muted/30">
								<CardContent className="pt-6">
									<div className="flex gap-3">
										<AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
										<div className="text-sm text-muted-foreground space-y-1">
											<p className="font-medium text-foreground">Lưu ý:</p>
											<ul className="list-disc list-inside space-y-1">
												<li>Vui lòng kiểm tra kỹ thông tin trước khi thanh toán</li>
												<li>Họ tên phải trùng với giấy tờ tùy thân</li>
											</ul>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
