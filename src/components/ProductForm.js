// src/components/ProductForm.js
import React, { useState } from 'react';
import axios from 'axios';
import "../styles/ProductForm.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    imageUrl: '',
    productCode: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // ✅ 토큰 불러오기

    try {
      const res = await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 토큰 추가
        },
      });
      alert(res.data); // 예: 상품 등록 완료 (ID: 1)
    } catch (error) {
      alert('등록 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>상품 등록</h2>
      <input name="name" placeholder="상품명" value={formData.name} onChange={handleChange} required />
      <input name="category" placeholder="카테고리" value={formData.category} onChange={handleChange} required />
      <input name="unit" placeholder="단위" value={formData.unit} onChange={handleChange} required />
      <input name="imageUrl" placeholder="이미지 URL" value={formData.imageUrl} onChange={handleChange} />
      <input name="productCode" placeholder="상품 코드" value={formData.productCode} onChange={handleChange} required />
      <button type="submit">등록</button>
    </form>
  );
};

export default ProductForm;
