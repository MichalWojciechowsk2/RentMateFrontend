import { useState } from "react";
import { FaStarHalf } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { createReview } from "../../api/review";
import type { ReviewDto } from "../../types/Review";

type AddReviewProps = {
  onCancel: () => void;
  propertyId?: number;
  userId?: number;
};

const AddReviewComponent: React.FC<AddReviewProps> = ({
  propertyId,
  userId,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    rating: 0,
    comment: "",
  });
  const [errors, setErrors] = useState<{ comment?: string }>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reviewToSend: ReviewDto = {
      propertyId: propertyId,
      userId: userId,
      rating: rating,
      comment: form.comment,
    };
    createReview(reviewToSend);
    onCancel();
  };

  const getStarType = (index: number) => {
    const value = index + 1;

    if (hoverRating >= value) return "full";
    if (!hoverRating && rating >= value) return "full";

    if (!hoverRating && rating === index + 0.5) return "half";
    if (hoverRating === index + 0.5) return "half";

    return "empty";
  };

  return (
    <div className="pl-4 pr-4 pb-4 max-w-xl mx-auto w-full relative rounded shadow-l">
      <div className="w-full flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold"></h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-[#1b2947] hover:text-blue-700 font-bold text-xl bg-transparent"
        >
          ×
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full"
      >
        <div className="flex items-center justify-center space-x-3 text-5xl sm:text-6xl w-full">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="relative cursor-pointer w-10 h-10 sm:w-12 sm:h-12"
              onMouseLeave={() => setHoverRating(0)}
              onClick={(e) => {
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                const clickX = e.clientX - rect.left;

                if (clickX < rect.width / 2) {
                  setRating(index + 0.5);
                } else {
                  setRating(index + 1);
                }
              }}
            >
              {/* 🟡 lewa połowa */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full z-30"
                onMouseEnter={() => setHoverRating(index + 0.5)}
              />
              {/* 🟡 prawa połowa */}
              <div
                className="absolute right-0 top-0 w-1/2 h-full z-30"
                onMouseEnter={() => setHoverRating(index + 1)}
              />

              {/* ⭐ tło */}
              <FaStar className="text-gray-400 absolute inset-0 m-auto z-0" />

              {/* ⭐ połówka */}
              {getStarType(index) === "half" && (
                <FaStarHalf className="text-yellow-300 absolute inset-0 m-auto z-20" />
              )}

              {/* ⭐ pełna */}
              {getStarType(index) === "full" && (
                <FaStar className="text-yellow-300 absolute inset-0 m-auto z-20" />
              )}
            </div>
          ))}
        </div>

        {/* ✏️ Komentarz */}
        <div className="mt-4 w-full max-w-3xl">
          <label className="block mb-1 font-medium text-gray-900">
            Komentarz
          </label>
          <textarea
            className="w-full border p-3 rounded text-base min-h-[120px] text-gray-900 text-m bg-gray-100 text-sm"
            value={form.comment}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            rows={4}
            required
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-[#1b2947] text-white rounded hover:bg-blue-600 transition items-end"
        >
          Dodaj recenzję
        </button>
      </form>
    </div>
  );
};

export default AddReviewComponent;
