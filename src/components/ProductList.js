import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProductList.css";

// 토큰 확인
const token = localStorage.getItem("token");
console.log("현재 토큰:", token);

// Base64URL → Base64 보정
const b64urlToB64 = (s) => {
  if (!s) return "";
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad === 2) s += "==";
  else if (pad === 3) s += "=";
  else if (pad !== 0) s += "===";
  return s;
};

// payload 디코딩
if (token) {
  const payload = JSON.parse(atob(b64urlToB64(token.split(".")[1])));
  console.log("JWT Payload:", payload);
}

const getRoles = () => {
  // 1순위: 로그인 시 저장해둔 roles
  try {
    const saved = JSON.parse(localStorage.getItem("roles") || "[]");
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (_) {}

  // 2순위: JWT에서 roles 추출
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return [];
    const payload = JSON.parse(atob(b64urlToB64(payloadPart)));
    return Array.isArray(payload?.roles) ? payload.roles : [];
  } catch (_) {
    return [];
  }
};

function ProductList({ products, onUpdate }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // token/roles 변경될 때마다 다시 계산되도록 의존성 줌
  const token = localStorage.getItem("token");
  const rolesStr = localStorage.getItem("roles");

  const isAdmin = useMemo(() => {
    const roles = getRoles();
    return roles.includes("ADMIN");
    // token/roles가 바뀌면 재계산
  }, [token, rolesStr]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("관리자만 삭제할 수 있습니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("삭제되었습니다.");
      onUpdate?.();
    } catch (err) {
      alert("삭제 실패: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("관리자만 수정할 수 있습니다.");
      return;
    }
    navigate(`/edit/${id}`);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="product-list-container full-width">
      <h2 className="product-list-title">🛍️ 상품 목록</h2>

      <input
        className="search-bar"
        type="text"
        placeholder="🔍 상품명 검색"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {selectedProducts.length === 0 ? (
        <p className="no-results">검색된 상품이 없습니다.</p>
      ) : (
        <div className="product-grid wide-grid">
          {selectedProducts.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <div className="product-card-body">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-img"
                  />
                )}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="product-category">{product.category}</p>
                </div>
              </div>

              <div className="product-actions-fixed">
              <button
                  className="order-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${product.id}`);
                  }}
                >
                  🛒 주문
                </button>
                {isAdmin && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={(e) => handleEdit(product.id, e)}
                    >
                      ✏ 수정
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDelete(product.id, e)}
                    >
                      🗑 삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
