"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { FeedbackStatsCards } from "./components/FeedbackStatsCards"
import { FeedbackFilters } from "./components/FeedbackFilters"
import { FeedbackList } from "./components/FeedbackList"
import { ReplyDialog } from "./components/ReplyDialog"
import type { Feedback } from "./components/FeedbackCard"

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "replied" | "resolved">("all")
  const [filterRating, setFilterRating] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")

  // Mock data - replace with real API call
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: "FB001",
      userId: "U001",
      userName: "Nguyễn Văn A",
      userEmail: "nguyenvana@email.com",
      rating: 5,
      category: "service",
      subject: "Dịch vụ tuyệt vời",
      message: "Tôi rất hài lòng với dịch vụ đặt vé online. Giao diện dễ sử dụng, thanh toán nhanh chóng.",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "FB002",
      userId: "U002",
      userName: "Trần Thị B",
      userEmail: "tranthib@email.com",
      rating: 3,
      category: "train",
      subject: "Tàu hơi chậm",
      message: "Tàu SE3 ngày hôm qua chậm 30 phút so với lịch trình. Mong công ty cải thiện đúng giờ hơn.",
      status: "replied",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      repliedAt: new Date(Date.now() - 43200000).toISOString(),
      reply: "Chúng tôi xin lỗi vì sự bất tiện này. Chúng tôi sẽ làm việc với đội ngũ vận hành để cải thiện tình hình.",
      repliedBy: "Staff001",
    },
  ])

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((f) => f.status === "pending").length,
    replied: feedbacks.filter((f) => f.status === "replied").length,
    resolved: feedbacks.filter((f) => f.status === "resolved").length,
    avgRating: feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0,
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || feedback.status === filterStatus
    const matchesRating = filterRating === "all" || feedback.rating === parseInt(filterRating)

    return matchesSearch && matchesStatus && matchesRating
  })

  const handleReply = () => {
    if (!selectedFeedback || !replyMessage.trim()) {
      return
    }

    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === selectedFeedback.id
          ? {
              ...f,
              status: "replied" as const,
              reply: replyMessage,
              repliedAt: new Date().toISOString(),
              repliedBy: "Staff001",
            }
          : f,
      ),
    )

    setShowReplyDialog(false)
    setReplyMessage("")
    setSelectedFeedback(null)
  }

  const handleMarkResolved = (feedbackId: string) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, status: "resolved" as const } : f)))
  }

  const handleDelete = (feedbackId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId))
    }
  }

  const handleOpenReplyDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setShowReplyDialog(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý phản hồi" description="Xem và trả lời phản hồi từ khách hàng" icon={MessageSquare} />

      <FeedbackStatsCards stats={stats} />

      <FeedbackFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <FeedbackList
        feedbacks={filteredFeedbacks}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onReply={handleOpenReplyDialog}
        onMarkResolved={handleMarkResolved}
        onDelete={handleDelete}
      />

      <ReplyDialog
        isOpen={showReplyDialog}
        onClose={() => setShowReplyDialog(false)}
        selectedFeedback={selectedFeedback}
        replyMessage={replyMessage}
        onReplyMessageChange={setReplyMessage}
        onSubmitReply={handleReply}
      />
    </div>
  )
}
