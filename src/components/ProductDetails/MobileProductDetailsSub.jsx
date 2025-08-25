import React, { useState, useEffect } from "react";
import client from "../../api/client";

const MobileProductDetailsSub = (props) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const mobileNumber = localStorage.getItem("mobileNumber");
  const { productId } = props;

  useEffect(() => {
    const fetchProductData = async () => {
      if (productId) {
        try {
          const reviewsResponse = await client.get(`/reviews/${productId}`);
          if (reviewsResponse.status === 200) {
            setReviews(reviewsResponse.data?.reviews || []);
          }

          const questionsResponse = await client.get(`/questions/${productId}`);
          if (questionsResponse.status === 200) {
            setQuestions(questionsResponse.data?.questions || []);
          }
        } catch (error) {
          console.error("Failed to fetch product data:", error.response?.data?.message);
          setReviews([]);
          setQuestions([]);
        }
      }
    };

    fetchProductData();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      const { data, status } = await client.post(
        `/products/reviews/${productId}/${mobileNumber}`,
        { review: newReview },
        { headers: { "Content-Type": "application/json" } }
      );
      if (status === 201) {
        setReviews([...reviews, data.data]);
        setNewReview("");
      }
    } catch (error) {
      console.error("Error during Review submission:", error.response?.data?.message || "Failed");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const { data, status } = await client.post(
        `/products/questions/${productId}/${mobileNumber}`,
        { question: newQuestion },
        { headers: { "Content-Type": "application/json" } }
      );
      if (status === 201) {
        setQuestions([...questions, data.data]);
        setNewQuestion("");
      }
    } catch (error) {
      console.error("Error during question submission:", error.response?.data?.message || "Failed");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "careGuide":
        return (
          <div className="text-sm text-gray-700 space-y-2">
            <h3 className="font-semibold text-gray-900">General Washing & Care Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Read Labels: Always check the care label on each item.</li>
              <li>Wash with Similar Colours to prevent colour bleeding.</li>
              <li>Turn Inside Out: Helps preserve appearance.</li>
              <li>Use Gentle Detergent suitable for delicate fabrics.</li>
              <li>Avoid Overloading to prevent stretching or damage.</li>
            </ul>
          </div>
        );
      case "materials":
        return (
          <div className="text-sm text-gray-700 space-y-2">
            <h3 className="font-semibold text-gray-900">Loop Knit Cotton Material</h3>
            <p>Soft, breathable, durable, and perfect for casual wear.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Breathable & Moisture-Wicking</li>
              <li>Stretchy & Flexible</li>
              <li>Durable & Long-Lasting</li>
              <li>Eco-Friendly</li>
            </ul>
          </div>
        );
      case "productTagNotice":
        return (
          <div className="text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Product Tag Notice</h3>
            <p>Do not remove the original product tag to remain eligible for return/exchange.</p>
          </div>
        );
      case "reviews":
        return (
          <div className="p-4 bg-white rounded-md space-y-4">
            <h3 className="font-semibold text-xl">Rating & Review</h3>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★ ★ ★ ★ ☆</span>
              <p className="text-gray-600">Based on {reviews.length} Reviews</p>
            </div>
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="border-t border-gray-200 pt-2">
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-gray-600">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">There are no reviews yet.</p>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-2">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                placeholder="Write your review..."
                rows={4}
                required
              />
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Submit Review
              </button>
            </form>
          </div>
        );
      case "questions":
        return (
          <div className="p-4 bg-white rounded-md space-y-4">
            <h3 className="font-semibold text-xl">Question & Answer</h3>
            <p className="text-gray-600">{questions.length} Questions</p>
            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={idx} className="border-t border-gray-200 pt-2">
                  <p className="font-semibold">{q.user}</p>
                  <p className="text-gray-600">{q.question}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No questions found.</p>
            )}
            <form onSubmit={handleQuestionSubmit} className="space-y-2">
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-2 border rounded-md resize-none"
                placeholder="Ask a question..."
                rows={4}
                required
              />
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Submit Question
              </button>
            </form>
          </div>
        );
      case "shippingReturns":
        return (
          <div className="text-sm text-gray-700 space-y-2">
            <h3 className="font-semibold text-gray-900">Shipping</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Free shipping across India</li>
              <li>Dispatch within 7–9 working days</li>
              <li>Tracking details sent via email/WhatsApp</li>
            </ul>
            <h3 className="font-semibold text-gray-900 mt-2">Returns</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>10-day return policy from delivery date</li>
              <li>Products must be unused and with original tags</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "careGuide", label: "Care Guide" },
    { id: "materials", label: "Materials" },
    { id: "productTagNotice", label: "Product Tag Notice" },
    { id: "reviews", label: "Reviews" },
    { id: "questions", label: "Questions" },
    { id: "shippingReturns", label: "Shipping & Returns" },
  ];

  return (
    <div className="bg-[#f5f5f5] p-4 font-sans max-w-[1200px] mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 py-2 bg-white rounded-lg shadow-sm px-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-1/3 sm:w-auto px-3 py-2 text-center text-sm font-medium rounded-full transition-colors ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">{renderContent()}</div>
    </div>
  );
};

export default MobileProductDetailsSub;
