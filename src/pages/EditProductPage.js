// src/pages/EditProductPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    unit: "",
    imageUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // 🔑 토큰 가져오기
  
    axios.get(`http://localhost:8080/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 인증 헤더 추가
      },
    })
      .then((res) => {
        const { name, category, unit, imageUrl } = res.data;
        setProduct({ name, category, unit, imageUrl: imageUrl || "" });
      })
      .catch((err) => {
        alert("상품 정보 로딩 실패");
        console.error(err);
      });
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
  
    axios.patch(`http://localhost:8080/api/products/${id}`, product, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
      },
    })
      .then(() => {
        alert("상품 수정 완료");
        navigate("/", { state: { updated: true } });
      })
      .catch((err) => {
        alert("수정 실패: " + err.message);
      });
  };

  return (
    <div>
      <h2>상품 수정</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="카테고리"
          value={product.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="단위"
          value={product.unit}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="이미지 URL"
          value={product.imageUrl}
          onChange={handleChange}
        />
        <button type="submit">수정</button>
      </form>
    </div>
  );
}

export default EditProductPage;
