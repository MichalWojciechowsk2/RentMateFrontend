import React, { useEffect, useState } from "react";
import type { ReviewEntity } from "../../types/Review";
import {
  getAllReviewsForUserByUserId,
  getAllReviewsForPropertyByPropertyId,
} from "../../api/review";

type Props = {
  isUserReviews: boolean;
  objectId: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function MoreReviewModal({
  isUserReviews,
  objectId,
  isOpen,
  onClose,
}: Props) {
  const [reviews, setReviews] = useState<ReviewEntity[]>([]);

  const fetchReviews = async (id: number) => {
    if (isUserReviews) {
      const data = await getAllReviewsForUserByUserId(id);
      setReviews(data);
    } else {
      const data = await getAllReviewsForPropertyByPropertyId(id);
      setReviews(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews(objectId);
    } else {
      setReviews([]);
    }
  }, [objectId, isUserReviews, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[80vh] overflow-y-auto shadow-xl p-6 space-y-4">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Opinie</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xl rounded-lg bg-[#1d2b4b] hover:bg-gray-300 mb-2"
          >
            X
          </button>
        </div>

        {/* Lista opinii */}
        {reviews
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((r) => (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">
                  {r.author
                    ? `${r.author.firstName} ${r.author.lastName}`
                    : "Anonim"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center mb-2 text-black">
                ⭐ {r.rating}
              </div>

              <p className="text-gray-700 text-sm whitespace-pre-line">
                {r.comment}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
