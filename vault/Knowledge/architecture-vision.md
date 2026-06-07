# Art-Tech Therapy — Architecture & Vision (migrated)

- Source(s): migrated verbatim from `docs/first-draft.md` (originally authored in the
  project's Google Drive `docs/` folder). This is the canonical MVP design narrative.

## Summary
A data-driven ecosystem fusing cinematic art with Jungian depth psychology. Two
acquisition funnels (Cinematic Art Funnel → awareness; Web Platform → therapy/discovery).
The MVP is "The Mirror," an intelligent psychological journal with three modules:
Repository (storage + auto Jungian tagging), Alchemist (Gemini symbolic analysis), and
Constellation (individuation dashboard).

---

## Original content (verbatim)

# TÀI LIỆU KIẾN TRÚC: HỆ SINH THÁI ART-TECH THERAPY (JUNGian FRAMEWORK)
Version: 1.0 (MVP Phase)
Author: Web Developer & Filmmaker

## 1. TẦM NHÌN CHIẾN LƯỢC (THE VISION)
Xây dựng một hệ sinh thái toàn diện kết hợp giữa Nghệ thuật Điện ảnh và Trị liệu Tâm lý dựa trên nền tảng dữ liệu (Data-driven). Hệ thống lấy khung lý thuyết Tâm lý học phân tích của Carl Jung làm kim chỉ nam để giúp người dùng thấu hiểu bản thân và chữa lành.

## 2. PHÂN KHÚC KHÁCH HÀNG & PHỄU CHUYỂN ĐỔI

### Kênh 1: Phễu Nhận thức (Cinematic Art Funnel)
- Đối tượng: Người chưa có kiến thức/nhu cầu về tâm lý, hoặc người có nhận thức nhưng không gặp vấn đề.
- Tiếp cận: Thông qua các bộ phim điện ảnh nghệ thuật tự thân (Solo/AI filmmaking).
- Cơ chế kích hoạt: Cài cắm các câu hỏi tâm lý bỏ ngỏ trong phim để kích thích người xem suy ngẫm, từ đó thu thập insight ngầm và dẫn dắt họ về trang web.

### Kênh 2: Phễu Trị liệu & Khai phá (The Web Platform)
- Đối tượng: Người đang gặp vấn đề tâm lý, người muốn tìm hiểu bản thân, người đã có kiến thức muốn phát triển bản thân, hoặc người cần người lắng nghe.
- Giải pháp cung cấp: Mối quan hệ chuyên gia - khách hàng, kiến thức tâm lý cá nhân hóa, bản đồ tâm thức và liệu trình chuyên sâu.

## 3. KIẾN TRÚC TÍNH NĂNG MVP (THE INTELLIGENT JOURNAL)
Mục tiêu giai đoạn 1 là xây dựng trang web "Nhật ký tâm lý thông minh" (The Mirror) để cấu trúc hóa dữ liệu vô thức của người dùng.

### Module 1: The Repository (Kho lưu trữ tâm thức)
- Chức năng: Lưu trữ nhật ký suy nghĩ, nhật ký giấc mơ, nhật ký tâm trí.
- Kỹ thuật: Rich text editor, Audio-to-text. Tự động gắn tag thông minh theo thuật ngữ Jungian (#Shadow, #Anima, #Ego) dựa trên phân tích NLP ngầm.

### Module 2: The Alchemist (Bộ lọc phân tích)
- Chức năng: Xử lý dữ liệu phi cấu trúc từ nhật ký.
- Cơ chế AI: Sử dụng Gemini API đưa ra phản hồi mang tính gợi mở, áp dụng kỹ thuật Tưởng tượng chủ động (Active Imagination), đặt câu hỏi ngược để người dùng tự đối thoại với "Bóng tối" (Shadow) của mình.

### Module 3: The Constellation (Bản đồ tiến trình)
- Chức năng: Trực quan hóa con người cá nhân.
- Giao diện: Dashboard biểu đồ (Chart.js/D3.js) hiển thị tần suất xuất hiện của các phức cảm và tiến trình Cá nhân hóa (Individuation Process) theo thời gian.

## 4. ĐỀ XUẤT STACK CÔNG NGHỆ CHUẨN (Dành cho Antigravity thực thi)
- Frontend: Next.js (App Router) + Tailwind CSS + Shadcn/ui (Tối ưu giao diện bảo mật, tối giản).
- Backend: Node.js (Express) hoặc Next.js Serverless Functions.
- Database: PostgreSQL (hoặc SQL Server) tích hợp Pgvector để thực hiện Vector Similarity Search trên các bài viết nhật ký/giấc mơ, tìm ra các mô thức tâm lý lặp đi lặp lại.
- AI Integration: Cấu hình Structured JSON Output tại Google AI Studio để đảm bảo API trả về data sạch.

## Related notes
- [[_migrated-from-google-docs]]
- [[jungian-analysis-domain]]
