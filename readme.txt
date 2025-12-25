# 📘 QUY TRÌNH PHÁT TRIỂN & HƯỚNG DẪN: QUIZ MASTER PRO

## 1. Giới thiệu
Ứng dụng tạo đề thi trắc nghiệm chạy trực tiếp trên trình duyệt (không cần Server).
**Tính năng nổi bật:**
- Giao diện Glassmorphism (Kính mờ) hiện đại.
- Đọc file Word (.docx), PDF (.pdf), Text (.txt).
- AI tự động nhận diện đáp án đúng (từ các từ khóa "đáp án đúng", "DA",...).
- Hỗ trợ định dạng câu hỏi linh hoạt (1 dòng hoặc nhiều dòng).
- Chế độ Review (Xem lại) chi tiết câu đúng/sai sau khi nộp bài.

---

## 2. Kịch bản Prompts (Dành cho AI)
Dưới đây là lịch sử các câu lệnh (Prompts) được sử dụng để xây dựng ứng dụng này từ con số 0 đến phiên bản hoàn thiện. Bạn có thể dùng chuỗi lệnh này để yêu cầu AI viết lại code.

### 📌 Giai đoạn 1: Khởi tạo cơ bản
> "Tạo 1 app giúp người dùng làm trắc nghiệm: người dùng input các câu trắc nghiệm vào và sau đó ứng dụng sẽ hiện lên câu hỏi và câu trả lời, cuối cùng sẽ là đáp án đúng. Sử dụng HTML, CSS, JS trong 1 file duy nhất."

### 📌 Giai đoạn 2: Nâng cấp giao diện & Logic nhập liệu
> "Hãy chỉnh sửa lại giao diện sao cho nhìn bắt mắt hơn, hiện đại hơn. Đồng thời tạo thêm chức năng 'Nhập nhanh': người dùng dán văn bản vào (ví dụ: 'Câu 1: 1+1=? A.1 B.2 C.3 D.4 đáp án đúng B'), hệ thống tự tách câu hỏi và đáp án."

### 📌 Giai đoạn 3: Xử lý nhập hàng loạt
> "Tối ưu hóa hàm nhập liệu để người dùng có thể input hàng chục câu hỏi cùng lúc (mỗi câu 1 dòng hoặc nhiều dòng) chứ không phải nhập từng câu một."

### 📌 Giai đoạn 4: Tính năng đọc File (Word/PDF)
> "Tích hợp thư viện Mammoth.js và PDF.js để ứng dụng có thể đọc trực tiếp file .docx và .pdf từ máy tính người dùng, chuyển thành văn bản và tự động điền vào ô nhập liệu."

### 📌 Giai đoạn 5: Fix lỗi & Tự nhận diện đáp án thông minh
> "Cập nhật logic phân tích:
> 1. Xử lý trường hợp câu hỏi và đáp án nằm trên cùng 1 dòng.
> 2. Tự động tìm cụm từ 'đáp án đúng X' hoặc 'DA X' ở cuối câu để set đáp án đúng.
> 3. Xóa cụm từ lộ đề đó khỏi nội dung câu hỏi hiển thị.
> 4. Thêm màn hình 'Chỉnh sửa' trước khi thi để người dùng review lại các đáp án đã nhận diện."

### 📌 Giai đoạn 6: Tính năng Review & Giao diện Premium
> "Thêm tính năng 'Xem lại bài' sau khi có kết quả: Hiển thị lại toàn bộ đề, tô xanh câu đúng, tô đỏ câu sai và hiện đáp án đúng thực tế. Cuối cùng, hãy thiết kế lại giao diện theo phong cách Glassmorphism (hiệu ứng kính), font chữ Inter, màu sắc gradient chuyên nghiệp như một ứng dụng trả phí."

---

## 3. SIÊU PROMPT (Tạo 1 lần ra ngay)
Nếu bạn lười nhập từng bước, hãy copy **đoạn văn bản dưới đây** và dán vào Gemini. Nó tóm tắt toàn bộ yêu cầu vào một lệnh duy nhất:

> **COPY TỪ ĐÂY:**
>
> "Hãy viết cho tôi một ứng dụng Web (Single File HTML bao gồm CSS/JS) để tạo và làm bài thi trắc nghiệm. 
>
> **Yêu cầu về Giao diện (UI/UX):**
> - Thiết kế theo phong cách Glassmorphism (hiệu ứng kính mờ), hiện đại, chuyên nghiệp (Premium).
> - Sử dụng Font chữ 'Inter', màu chủ đạo là Gradient tím/indigo.
> - Có hiệu ứng chuyển động (Animation) mượt mà khi chuyển đổi giữa các màn hình.
> - Hiển thị kết quả bằng biểu đồ vòng tròn (Score Circle).
>
> **Yêu cầu về Tính năng (Logic):**
> 1. **Nhập liệu đa năng:** Cho phép upload file Word (.docx), PDF (.pdf) hoặc file Text (.txt) để lấy nội dung. Sử dụng thư viện Mammoth.js và PDF.js qua CDN.
> 2. **Phân tích thông minh (AI Detect):** >    - Tự động tách câu hỏi và 4 đáp án A, B, C, D (kể cả khi chúng nằm cùng 1 dòng hoặc xuống dòng).
>    - Tự động phát hiện đáp án đúng dựa vào các từ khóa cuối câu như: 'Đáp án đúng A', 'DA: B', 'Đáp án C'...
>    - Tự động xóa các từ khóa lộ đề này khỏi nội dung câu hỏi khi hiển thị.
> 3. **Quy trình:** Upload File -> Màn hình Review (cho phép sửa lại đáp án đúng nếu AI nhận diện sai) -> Màn hình Làm bài -> Màn hình Kết quả.
> 4. **Chế độ Xem lại (Review Mode):** Sau khi nộp bài, cho phép xem lại chi tiết: câu nào đúng (màu xanh), câu nào sai (màu đỏ), và hiển thị đáp án đúng thực tế.
>
> Hãy viết mã nguồn hoàn chỉnh, sạch sẽ và chạy được ngay lập tức."

---

## 4. Hướng dẫn cài đặt
1. Tạo một thư mục mới trên máy tính.
2. Tạo file `index.html`.
3. Dán toàn bộ code vào file này.
4. Mở file bằng trình duyệt Chrome/Edge để sử dụng.