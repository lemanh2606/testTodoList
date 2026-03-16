/**
 * ============================================================
 *  ENTRY POINT - Điểm khởi đầu của ứng dụng
 * ============================================================
 *
 * CẤU TRÚC PROVIDERS (từ ngoài vào trong):
 *
 *  <StrictMode>           ← React strict checks (dev only)
 *    <Provider store={store}> ← Redux: inject store vào toàn bộ app
 *      <App />            ← Toàn bộ UI của ứng dụng
 *    </Provider>
 *  </StrictMode>
 *
 * Tại sao Provider phải bọc ngoài App?
 *  → Bất kỳ component nào trong cây cũng có thể gọi
 *    useAppSelector() và useAppDispatch() mà không cần
 *    truyền props qua từng tầng (không prop drilling)
 * ============================================================
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Redux Provider - kết nối store với React
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider inject Redux store vào context của React
        → mọi component con đều có thể truy cập store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
