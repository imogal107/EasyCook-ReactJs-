// RecipeModal.jsx
import React from "react";

const RecipeModal = ({ show, recipe, onClose }) => {
  if (!show || !recipe) return null;

  const instructions =
    recipe.strInstructions
      ?.split(".")
      .map((part) => part.trim())
      .filter(Boolean) || [];

  const handleBackdropClick = (e) => {
    // close only if user clicked directly on the backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-[90%] max-h-[80vh] overflow-y-auto p-6 relative"
      >
        <h2 className="text-2xl font-bold mb-4">{recipe.strMeal}</h2>

        <ul className="list-disc list-inside space-y-2 mb-6 text-sm md:text-base leading-relaxed">
          {instructions.map((step, index) => (
            <li key={index}>{step}.</li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
