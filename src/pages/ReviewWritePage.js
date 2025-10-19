import React from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

function ReviewWritePage() {
  const { productId } = useParams();

  return (
    <div className="review-write-container">
      <h2>📝 리뷰 작성</h2>
      <ReviewForm
        productId={productId}
        onReviewSubmitted={() => {
          alert("리뷰가 등록되었습니다!");
          window.history.back(); // 이전 페이지로 이동
        }}
      />
    </div>
  );
}

export default ReviewWritePage;