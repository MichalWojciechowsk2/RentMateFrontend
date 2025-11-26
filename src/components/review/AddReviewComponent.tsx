import { useState } from "react";
import { FaStarHalf } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";


const AddReviewComponent = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState<Omit<

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Ocena: ${rating}`);
  };

  const renderHalfStarColor = (value: number) => {
    if (hoverRating >= value) return "text-yellow-400";
    if (!hoverRating && rating >= value) return "text-yellow-400";
    return "text-gray-300";
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-0.5 text-6xl">
          {[...Array(5)].map((_, starIndex) => (
            <div
            className="relative cursor-pointer"
            onClick={(e) => {
            const target = e.currentTarget as unknown as HTMLElement;
            const rect = target.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 2) {
              setRating(starIndex + 0.5);
            } else {
              setRating(starIndex + 1);
            }
        }}
        >
            <IoIosStarOutline className="text-gray-300" />
            </div> 
          ))}
        </div>

        <div className="mt-2 text-lg">Ocena: {rating}</div>
        <div>
          <label htmlFor="amount" className="block mb-1 font-medium">
            Komentarz
          </label>
          <input
            id="amount"
            type="number"
            className="w-full border p-2 rounded"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value),
              }))
            }
            min={0}
            step={0.01}
            required
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Dodaj recenzję
        </button>
      </form>
    </div>
  );
};

export default AddReviewComponent;
