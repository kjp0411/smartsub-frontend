// src/pages/CartPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// .env에 REACT_APP_API_BASE 정의하면 그걸 사용, 없으면 로컬 기본값
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

const formatterKRW = new Intl.NumberFormat("ko-KR");

export default function CartPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false); // 수량 변경/삭제 중 버튼 잠금

  // 공통 axios 옵션
  const authHeaders =
    token && token.trim() !== ""
      ? { Authorization: `Bearer ${token}` }
      : undefined;

  // 401 처리
  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return true;
    }
    return false;
  };

  // 장바구니 조회
  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/cart/me`, {
        headers: authHeaders,
      });
      setCart(res.data);
    } catch (err) {
      if (!handleAuthError(err)) {
        console.error(err);
        alert("장바구니를 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 수량 변경
  const updateQty = async (productId, quantity) => {
    const q = Math.max(1, Math.min(99, Number(quantity) || 1));
    setBusy(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/api/cart/items/${productId}?quantity=${q}`,
        null,
        { headers: authHeaders }
      );
      setCart(res.data);
    } catch (err) {
      if (!handleAuthError(err)) {
        console.error(err);
        alert("수량 변경에 실패했습니다.");
      }
    } finally {
      setBusy(false);
    }
  };

  // 항목 삭제
  const removeItem = async (productId) => {
    if (!window.confirm("해당 상품을 장바구니에서 삭제할까요?")) return;
    setBusy(true);
    try {
      const res = await axios.delete(
        `${API_BASE}/api/cart/items/${productId}`,
        { headers: authHeaders }
      );
      setCart(res.data); // 컨트롤러가 CartResponse 반환하도록 구현됨
    } catch (err) {
      if (!handleAuthError(err)) {
        console.error(err);
        alert("삭제에 실패했습니다.");
      }
    } finally {
      setBusy(false);
    }
  };

  // 장바구니 비우기
  const clearCart = async () => {
    if (!window.confirm("장바구니를 모두 비울까요?")) return;
    setBusy(true);
    try {
      const res = await axios.delete(`${API_BASE}/api/cart/clear`, {
        headers: authHeaders,
      });
      if (res.status === 204) {
        setCart({ items: [], totalPrice: 0 });
      } else if (res.data) {
        setCart(res.data);
      } else {
        await loadCart();
      }
    } catch (err) {
      if (!handleAuthError(err)) {
        console.error(err);
        alert("장바구니 비우기에 실패했습니다.");
      }
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // 라우트 가드가 있어도 토큰이 비어있을 수 있으니 마지막 방어
    if (!token) {
      navigate("/login");
      return;
    }
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <div className="container" style={{ maxWidth: 900, margin: "24px auto" }}>
        <h2>장바구니</h2>
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")}>로그인 하러가기</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 900, margin: "24px auto" }}>
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 900, margin: "24px auto" }}>
      <h2 style={{ marginBottom: 16 }}>장바구니</h2>

      {cart.items.length === 0 ? (
        <div style={{ padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
          <p>장바구니가 비었습니다.</p>
          <button onClick={() => navigate("/products")}>상품 보러가기</button>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "12px 8px" }}>상품명</th>
                <th style={{ padding: "12px 8px" }}>단가</th>
                <th style={{ padding: "12px 8px" }}>수량</th>
                <th style={{ padding: "12px 8px" }}>합계</th>
                <th style={{ padding: "12px 8px" }} />
              </tr>
            </thead>
            <tbody>
              {cart.items.map((it) => (
                <tr key={it.productId} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 8px" }}>{it.productName}</td>
                  <td style={{ padding: "10px 8px" }}>
                    {formatterKRW.format(it.price)}원
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={it.quantity}
                      disabled={busy}
                      onChange={(e) => updateQty(it.productId, e.target.value)}
                      style={{ width: 68 }}
                    />
                  </td>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>
                    {formatterKRW.format(it.totalPrice)}원
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <button disabled={busy} onClick={() => removeItem(it.productId)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <button disabled={busy} onClick={clearCart}>
              장바구니 비우기
            </button>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              총 결제예정금액: {formatterKRW.format(cart.totalPrice)}원
            </div>
          </div>

          <div style={{ marginTop: 16, textAlign: "right" }}>
            <button onClick={() => navigate("/payments")}>결제하러 가기</button>
          </div>
        </>
      )}
    </div>
  );
}
