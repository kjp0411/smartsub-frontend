// src/components/PaymentList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentList() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
  
      const res = await axios.get("http://localhost:8080/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 인증 헤더 추가
        },
      });
      setPayments(res.data);
    } catch (err) {
      console.error("결제 목록 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>결제 내역</h2>
      {payments.length === 0 ? (
        <p>등록된 결제 내역이 없습니다.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id}>
              회원 {payment.memberId} – {payment.amount}원 / {payment.paymentMethod} / 상태: {payment.status}
              <br />
              <small>{payment.paidAt}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentList;
