import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import EditProductPage from "./pages/EditProductPage";
import PaymentPage from "./pages/PaymentPage";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import "./styles/App.css";
import ProductDetailPage from "./pages/ProductDetailPage";
import ReviewForm from "./components/ReviewForm"; // ✅ 경로 오타 수정
import ReviewWritePage from "./pages/ReviewWritePage";

import SlackAuthPage from "./pages/SlackAuthPage";
import SlackCallbackPage from "./pages/SlackCallbackPage";
import SlackQrAuthPage from "./pages/SlackQrAuthPage";

import { isAdminUser } from "./utils/auth"; // ✅ ADMIN 판별 유틸
import CartPage from "./pages/CartPage";

function AppContent() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // ADMIN 여부는 매 렌더링 시점에 토큰/roles를 기반으로 계산
  const isAdmin = isAdminUser();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products", {
        headers:
          token && token.trim() !== ""
            ? { Authorization: `Bearer ${token}` }
            : undefined,
      });
      console.log("📦 받은 상품:", res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("상품 목록 로딩 실패", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("memberId");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="navbar-left">
          <h2 className="logo" onClick={() => navigate("/")}>
            SmartSub
          </h2>
        </div>
        <div className="navbar-right">
          <button onClick={() => navigate("/products")}>🛒 상품 목록</button>
          {token ? (
            <>
              <button onClick={() => navigate("/payments")}>💳 결제 페이지</button>
              <button onClick={() => navigate("/slack-auth")}>🤖 Slack 인증</button>
              <button onClick={() => navigate("/cart")}>🛒 장바구니</button>
              <button onClick={handleLogout}>🔓 로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>🔐 로그인</button>
              <button onClick={() => navigate("/signup")}>📝 회원가입</button>
            </>
          )}
        </div>
      </header>

      <Routes>
        {/* 공개 페이지 */}
        <Route
          path="/products"
          element={<ProductList products={products} onUpdate={fetchProducts} />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <LoginForm onLogin={setToken} />}
        />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/reviews/write/:productId" element={<ReviewWritePage />} />
        <Route path="/slack-auth" element={<SlackAuthPage />} />
        <Route path="/slack/callback" element={<SlackCallbackPage />} />
        <Route path="/slack/qr-auth" element={<SlackQrAuthPage />} />
        <Route
          path="/cart"
          element={token ? <CartPage /> : <Navigate to="/login" replace state={{ from: "/cart" }} />}
        />

        {token ? (
          <>
            {/* 홈: ✅ ADMIN만 상품 등록 폼 보이게 */}
            <Route
              path="/"
              element={
                <>
                  {isAdmin && <ProductForm onSuccess={fetchProducts} />}
                  {isAdmin && <hr />}
                  <ProductList products={products} onUpdate={fetchProducts} />
                </>
              }
            />

            {/* ✅ 상품 수정 페이지: ADMIN만 접근 허용 */}
            <Route
              path="/edit/:id"
              element={
                isAdmin ? <EditProductPage /> : <Navigate to="/products" replace />
              }
            />

            {/* 로그인 사용자 전용 */}
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/review" element={<ReviewForm />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/edit/:id" element={<Navigate to="/login" replace />} />
            <Route path="/payments" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* fallback */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
