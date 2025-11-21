import { useState } from "react";
import { Heart } from "lucide-react";
import RecipeModal from "./RecipeModal";
const Card = ({ recipe }) => {

  const [showRecipe, setShowRecipe] = useState(false);

  const [isFavourite, setIsFavourite] = useState(
    localStorage.getItem("favourites")?.includes(recipe.strMeal)
  );

  const addRecipeToFavourites = () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const isRecipeAlreadyinFavourites = favourites.some(
      (fav) => fav.label === recipe.strMeal
    );

    if (isRecipeAlreadyinFavourites) {
      favourites = favourites.filter((fav) => fav.label !== recipe.strMeal);
      setIsFavourite(false);
    } else {
      favourites.push(recipe);
      setIsFavourite(true);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
  };

  const removeFromFavourites = () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    favourites = favourites.filter((fav) => fav.label !== recipe.strMeal);
    setIsFavourite(false);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  };

  return (
    <>
    <div className={`card bg-slate-200 w-full shadow-md m-4`}>
      {/* <figure className="relative"> */}

        <div className=" skeleton absolute inset-0"  />
        <img
          src={recipe.strMealThumb}
          alt="Shoes"
          loading="lazy"
          className="w-full h-40 object-cover cursor-pointer opacity-0 transition-opacity duration-500"
          onLoad={(e)=>{
            e.currentTarget.style.opacity=1;
            e.currentTarget.previousElementSibling.style.display = "none";
          }}
        />
        <div
          className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (isFavourite) {
              removeFromFavourites();
            } else {
              addRecipeToFavourites();
            }
          }}
        >
          {isFavourite && (
            <Heart size={24} className="fill-red-600 text-red-600" />
          )}
          {!isFavourite && (
            <Heart
              size={24}
              className="hover:fill-red-600 hover:text-red-600"
            />
          )}
        </div>
      {/* </figure> */}
      <div className="card-body ">
        <h2 className="card-title">
          {/* Dynamic Recipe Name  */}
          {recipe.strMeal}
        </h2>

        {/* dynamic kitchen name */}
        <p>{recipe.strArea}</p>
        <div className={`flex card-actions justify-end pt-2`}>
          <div
            className={`badge bg-slate-100 badge-ghost badge-lg  rounded-md text-xs cursor-pointer shadow-sm shadow-gray-900 hover:scale-105`}
            onClick={() => setShowRecipe(!showRecipe)}
          >
            <button className="p-1">Read Recipe</button>
          </div>
          <div
            className={`badge bg-slate-100 badge-ghost badge-lg rounded-md text-xs
            cursor-pointer shadow-sm shadow-gray-900 hover:scale-105`}
            onClick={() => window.open(recipe.strYoutube, "_blank")}
          >
                <a href={recipe.strYoutube} 
                  target="_blank"
                  className="relative"> 
                  <button className="p-1">Watch Video</button>
                </a>
          </div>
        </div>
      </div>
    </div>

   <RecipeModal
    show={showRecipe}
    recipe={recipe}
   onClose={() => setShowRecipe(false)}
      />

     </>
  );
};

export default Card;
