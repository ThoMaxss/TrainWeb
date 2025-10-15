import { Display, H1, H2, H3, Body, Lead, Small, Micro, Code, Blockquote, List, Muted } from "@/components/ui/typography";

export default function TypographyDemo() {
  return (
    <div className="container-fx py-8 space-y-8">
      {/* ===============================
          LAYER 1: Typography Components
          =============================== */}
      <section className="space-y-6">
        <H1>Typography System Demo</H1>
        <Lead>
          Hệ thống typography 3 layer: Components + Globals + Prose cho Train Booking App
        </Lead>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Typography Components */}
          <div className="space-y-4">
            <H2>1. Typography Components</H2>
            <Muted>Cho UI screens (forms, dashboard, cards)</Muted>
            
            <div className="space-y-3 border rounded-lg p-4 bg-card">
              <Display>Display Heading</Display>
              <H1>Heading 1</H1>
              <H2>Heading 2</H2>
              <H3>Heading 3</H3>
              <Body>Body text - Lorem ipsum dolor sit amet consectetur.</Body>
              <Lead>Lead text - Mô tả quan trọng hoặc intro paragraph.</Lead>
              <Small>Small text - Thông tin phụ</Small>
              <Micro>Micro text - Labels, captions</Micro>
              <Code>const code = "example";</Code>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-4">
            <H2>2. Real Use Cases</H2>
            <Muted>Áp dụng thực tế trong UI</Muted>
            
            {/* Card Example */}
            <div className="card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <H3>Chuyến tàu SE1</H3>
                  <Small className="text-muted-foreground">Hà Nội → TP.HCM</Small>
                </div>
                <Micro className="bg-green-100 text-emerald-800 px-2 py-1 rounded">
                  Còn chỗ
                </Micro>
              </div>
              <Body className="text-sm">
                Khởi hành: 19:30 - Thời gian: 31h 30m
              </Body>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-3 text-center">
                <Display className="text-2xl text-blue-600">1,234</Display>
                <Micro>Vé đã bán</Micro>
              </div>
              <div className="border rounded p-3 text-center">
                <Display className="text-2xl text-green-600">98%</Display>
                <Micro>Tỷ lệ hài lòng</Micro>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===============================
          LAYER 2: Globals CSS Demo
          =============================== */}
      <section className="space-y-4">
        <H2>3. Globals CSS Foundation</H2>
        <Muted>Default HTML elements được style sẵn trong globals.css</Muted>
        
        <div className="border rounded-lg p-4 bg-card space-y-3">
          <h1>HTML H1 - Được style tự động</h1>
          <h2>HTML H2 - Không cần class</h2>
          <h3>HTML H3 - Consistent spacing</h3>
          <p>
            HTML paragraph - Line height và spacing được tối ưu sẵn. 
            Selection cũng có style đẹp (thử select text này).
          </p>
          <p>
            Focus ring system cũng đã được setup cho accessibility. 
            Tab qua các element để thấy focus indicators đẹp.
          </p>
        </div>
      </section>

      {/* ===============================
          LAYER 3: Prose Plugin Demo
          =============================== */}
      <section className="space-y-4">
        <H2>4. Prose Plugin</H2>
        <Muted>Cho long-form content (blog, docs, terms)</Muted>
        
        <div className="prose prose-slate max-w-none border rounded-lg p-6 bg-card">
          <h1>Điều khoản sử dụng dịch vụ</h1>
          <p className="lead">
            Chào mừng bạn đến với hệ thống đặt vé tàu trực tuyến. 
            Vui lòng đọc kỹ các điều khoản sau.
          </p>
          
          <h2>1. Quyền và nghĩa vụ của khách hàng</h2>
          <p>
            Khách hàng có quyền đặt vé, hủy vé theo quy định. 
            Đồng thời cần tuân thủ các quy tắc an toàn và nội quy nhà ga.
          </p>

          <h3>1.1 Quy trình đặt vé</h3>
          <ol>
            <li>Chọn tuyến đường và thời gian</li>
            <li>Điền thông tin hành khách</li>
            <li>Thanh toán trực tuyến</li>
            <li>Nhận vé điện tử</li>
          </ol>

          <h3>1.2 Chính sách hủy vé</h3>
          <ul>
            <li><strong>Trước 24h:</strong> Hoàn 100% giá vé</li>
            <li><strong>12-24h:</strong> Hoàn 80% giá vé</li>
            <li><strong>Dưới 12h:</strong> Hoàn 50% giá vé</li>
          </ul>

          <blockquote>
            <p>
              Lưu ý: Các chuyến tàu đặc biệt và ngày lễ có thể có 
              chính sách khác. Vui lòng kiểm tra kỹ trước khi đặt vé.
            </p>
          </blockquote>

          <h2>2. Liên hệ hỗ trợ</h2>
          <p>
            Nếu cần hỗ trợ, vui lòng liên hệ hotline <code>1900-123-456</code> 
            hoặc email <a href="mailto:support@trainbooking.com">support@trainbooking.com</a>
          </p>
        </div>
      </section>

      {/* ===============================
          LAYER SUMMARY
          =============================== */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <H2 className="text-blue-900">Tổng kết 3 Layer Strategy</H2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <H3 className="text-blue-800">1. Typography Components</H3>
            <Small className="text-blue-700">
              ✅ UI screens (forms, dashboard)<br/>
              ✅ Consistent spacing/type scale<br/>
              ✅ Easy theme switching<br/>
              ✅ Good tree-shaking
            </Small>
          </div>
          
          <div className="space-y-2">
            <H3 className="text-blue-800">2. Globals CSS</H3>
            <Small className="text-blue-700">
              ✅ One-time setup cho toàn app<br/>
              ✅ Default HTML styling<br/>
              ✅ Font smoothing, selection<br/>
              ✅ Focus ring system
            </Small>
          </div>
          
          <div className="space-y-2">
            <H3 className="text-blue-800">3. Prose Plugin</H3>
            <Small className="text-blue-700">
              ✅ Long-form content<br/>
              ✅ Auto style HTML elements<br/>
              ✅ Blog, docs, terms pages<br/>
              ✅ Professional typography
            </Small>
          </div>
        </div>
      </section>
    </div>
  );
}