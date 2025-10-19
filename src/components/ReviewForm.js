import React, { useState } from "react";
import axios from "axios";

function ReviewForm({ productId, onReviewSubmitted }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/api/reviews",
        { productId, content, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("리뷰가 등록되었습니다.");
      setContent("");
      setRating(5);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
      alert("리뷰 등록 실패: " + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h3>리뷰 작성</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰 내용을 입력하세요"
        rows={4}
        style={{ width: "100%", padding: "8px" }}
        required
      />
      <br />
      <label>
        별점:
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          style={{ marginLeft: "8px" }}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit" style={{ marginTop: "8px", padding: "8px 16px" }}>
        리뷰 등록
      </button>
    </form>
  );
}

export default ReviewForm;
