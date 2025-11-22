export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "1",
    category: "booking",
    question: "Làm thế nào để đặt vé tàu trực tuyến?",
    answer: "Để đặt vé tàu, bạn cần: 1) Đăng nhập vào tài khoản, 2) Chọn tuyến đường và ngày giờ khởi hành, 3) Chọn loại ghế/toa tàu phù hợp, 4) Điền thông tin hành khách, 5) Thanh toán và nhận vé điện tử qua email.",
  },
  {
    id: "2",
    category: "booking",
    question: "Tôi có thể đặt vé cho bao nhiêu người cùng lúc?",
    answer: "Bạn có thể đặt tối đa 6 vé trong một lần giao dịch. Nếu cần đặt nhiều hơn, vui lòng liên hệ hotline để được hỗ trợ.",
  },
  {
    id: "3",
    category: "booking",
    question: "Thời gian đặt vé trước bao lâu?",
    answer: "Bạn có thể đặt vé trước từ 30 ngày đến 2 giờ trước giờ tàu chạy. Khuyến nghị đặt sớm để có nhiều lựa chọn chỗ ngồi.",
  },
  {
    id: "4",
    category: "payment",
    question: "Có những phương thức thanh toán nào?",
    answer: "Chúng tôi hỗ trợ: ATM/Thẻ nội địa, Visa/Mastercard, Ví điện tử (MoMo, ZaloPay, VNPay), QR Code và chuyển khoản ngân hàng.",
  },
  {
    id: "5",
    category: "payment",
    question: "Thanh toán không thành công thì làm sao?",
    answer: "Nếu thanh toán thất bại, vui lòng kiểm tra: 1) Số dư tài khoản, 2) Thông tin thẻ chính xác, 3) Kết nối internet ổn định. Nếu vẫn gặp lỗi, liên hệ ngân hàng hoặc hotline của chúng tôi.",
  },
  {
    id: "6",
    category: "payment",
    question: "Tôi có nhận được hóa đơn điện tử không?",
    answer: "Có, sau khi thanh toán thành công, bạn sẽ nhận được hóa đơn VAT điện tử qua email đã đăng ký.",
  },
  {
    id: "7",
    category: "refund",
    question: "Chính sách hoàn vé như thế nào?",
    answer: "Hoàn vé trước 24h: phí 20% giá vé. Từ 24h đến 2h trước giờ chạy: phí 30%. Trong vòng 2h hoặc sau giờ chạy: không được hoàn.",
  },
  {
    id: "8",
    category: "refund",
    question: "Bao lâu thì nhận được tiền hoàn?",
    answer: "Tiền hoàn sẽ được chuyển về tài khoản gốc trong vòng 5-7 ngày làm việc kể từ khi yêu cầu được xác nhận.",
  },
  {
    id: "9",
    category: "refund",
    question: "Tôi có thể đổi vé sang chuyến khác không?",
    answer: "Có, bạn có thể đổi vé sang chuyến khác cùng tuyến với phí 10% giá vé. Nếu chuyến mới đắt hơn, bạn cần đóng thêm phần chênh lệch.",
  },
  {
    id: "10",
    category: "account",
    question: "Làm sao để tạo tài khoản?",
    answer: "Nhấn 'Đăng ký' ở góc phải màn hình, điền thông tin cá nhân (email, số điện thoại, mật khẩu), xác thực OTP và hoàn tất.",
  },
  {
    id: "11",
    category: "account",
    question: "Quên mật khẩu thì làm gì?",
    answer: "Nhấn 'Quên mật khẩu' tại trang đăng nhập, nhập email đã đăng ký, làm theo hướng dẫn trong email để đặt lại mật khẩu mới.",
  },
  {
    id: "12",
    category: "account",
    question: "Thông tin cá nhân có được bảo mật không?",
    answer: "Tất cả thông tin cá nhân được mã hóa và bảo mật theo tiêu chuẩn quốc tế. Chúng tôi không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý.",
  },
];
