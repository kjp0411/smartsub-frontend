import React, { useState } from "react";
import axios from "axios";

function PaymentForm({ onSuccess }) {
  const [payment, setPayment] = useState({
    memberId: "",
    productId: "",
    amount: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8080/api/payments", payment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("결제 등록 완료");
      setPayment({
        memberId: "",
        productId: "",  // 초기화
        amount: "",
        paymentMethod: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      alert("결제 실패: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="memberId"
        placeholder="회원 ID"
        value={payment.memberId}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="productId"     // ✅ 상품 ID 입력 필드 추가
        placeholder="상품 ID"
        value={payment.productId}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="결제 금액"
        value={payment.amount}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="paymentMethod"
        placeholder="결제 수단"
        value={payment.paymentMethod}
        onChange={handleChange}
        required
      />
      <button type="submit">결제하기</button>
    </form>
  );
}

export default PaymentForm;
