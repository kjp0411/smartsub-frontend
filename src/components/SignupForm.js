// src/components/SignupForm.js
import React, { useState } from "react";
import axios from "axios";

function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/members", form);
      alert("회원가입 성공: " + res.data.message);
      setForm({ email: "", name: "", password: "" });
    } catch (err) {
      alert("회원가입 실패: " + (err.response?.data?.message || err.message || "알 수 없는 오류"));
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupForm;
