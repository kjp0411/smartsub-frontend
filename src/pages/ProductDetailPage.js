import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("상품 상세 로딩 실패", err);
        alert("상품 정보를 불러올 수 없습니다.");
        navigate("/products");
      });

    axios
      .get(`http://localhost:8080/api/reviews/product/${id}`)
      .then((res) => {
        const sortedReviews = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sortedReviews);
    })
      .catch((err) => {
        console.error("리뷰 불러오기 실패", err);
      });
  }, [id, navigate]);

  const handlePurchase = () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios
      .post(
        "http://localhost:8080/api/payments",
        {
          productId: product.id,
          amount: product.price * quantity,
          paymentMethod: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("결제가 완료되었습니다.");
        navigate("/payments");
      })
      .catch((err) => {
        console.error("결제 실패", err);
        alert("결제에 실패했습니다.");
      });
  };

  if (!product)
    return (
      <div className="loading">
        <div className="spinner"></div>
        상품 정보를 불러오는 중...
      </div>
    );

  return (
    <div className="product-detail-layout wide full-width">
      <div className="product-detail-container">
        <h2 className="product-title">🛒 {product.name}</h2>

        <div className="product-card fancy-card">
          {product.imageUrl && (
            <img
              className="product-image styled-img"
              src={product.imageUrl}
              alt={product.name}
            />
          )}

          <div className="product-info">
            <p className="product-price">
              가격: {product.price?.toLocaleString()}원
            </p>

            <div className="form-group">
              <label>수량:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input-box"
              />
            </div>

            <div className="form-group">
              <label>결제 수단:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select-box"
              >
                <option value="CARD">💳 카드</option>
                <option value="KAKAO_PAY">💛 카카오페이</option>
                <option value="ACCOUNT_TRANSFER">🏦 계좌이체</option>
              </select>
            </div>

            <p className="product-total">
              🧾 총 가격: {(product.price * quantity)?.toLocaleString()}원
            </p>

            <button
              className="purchase-button styled-button"
              onClick={handlePurchase}
            >
              🛍 결제하기
            </button>
          </div>
        </div>

        {/* ✅ 리뷰 영역 */}
        <div className="review-section" style={{ marginTop: "2rem" }}>
          <h3>📢 리뷰</h3>
          {reviews.length === 0 ? (
            <p>아직 작성된 리뷰가 없습니다.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} style={{ marginBottom: "1rem" }}>
                  <strong>⭐ {review.rating}</strong> - {review.content}
                  <br />
                  <small>
                    작성자: {review.memberName} |{" "}
                    {new Date(review.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
