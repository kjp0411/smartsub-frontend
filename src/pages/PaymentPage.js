// src/pages/PaymentPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import ReviewForm from "../components/ReviewForm";
import axios from "axios";

function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedPayments = res.data.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
      setPayments(sortedPayments);
    } catch (err) {
      console.error("결제 목록 로딩 실패", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleReviewClick = (productId) => {
    navigate(`/reviews/write/${productId}`);
  };

  return (
    <div>
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>
        ← 홈으로 돌아가기
      </button>

      <h2>결제 등록</h2>
      <PaymentForm onSuccess={fetchPayments} />

      <hr />

      <h2>결제 목록</h2>
      {payments.length === 0 ? (
        <p>결제 내역이 없습니다.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} style={{ marginBottom: "1rem" }}>
              상품: {payment.productName} (ID: {payment.productId})<br />
              회원 ID: {payment.memberId}<br />
              금액: {payment.amount}원<br />
              결제 수단: {payment.paymentMethod}<br />
              상태: {payment.status}<br />
              {payment.paidAt && (
                <>
                  결제일시: {new Date(payment.paidAt).toLocaleString()}<br />
                </>
              )}
              <button onClick={() => handleReviewClick(payment.productId)} style={{ marginTop: "0.5rem" }}>
                ✍ 리뷰 작성
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentPage;