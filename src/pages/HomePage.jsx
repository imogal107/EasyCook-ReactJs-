import React, { useEffect, useState } from "react";
// import SearchInput from "../components/SearchInput";
import { IoSearchSharp } from "react-icons/io5";
import Card from "../components/Card";
import { getRandomColor } from "../lib/utils";
const APP_ID = import.meta.env.VITE_APP_ID;
const APP_KEY = import.meta.env.VITE_APP_KEY;
const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async (searchQuery) => {
    setLoading(true);
    setRecipes([]);

    try {
      const res = await fetch(
        `https://api.edamam.com/api/recipes/v2/?app_id=${APP_ID}&app_key=${APP_KEY}&q=${searchQuery}&type=public`
      );
      const data = await res.json();
      setRecipes(data.hits);
      console.log(data.hits);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes("chicken");
  }, []);

  const handleSearchRecipe = (e) =>{
    e.preventDefault()
    fetchRecipes(e.target[0].value)

}
  return (
    <div className="flex-1 bg-slate-100 w-full min-h-screen items-center  lg:pl-20 lg:pr-20 ">
      <div className="flex items-center justify-center  w-full h-10 mt-16 mb-4">
      <form className="flex items-center gap-2 w-full ml-10 mr-10 relative cursor-pointer" onSubmit={handleSearchRecipe}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Recipes.."
          className="input text-lg font-serif input-sm  input-bordered border-slate-600 rounded w-full h-10 pl-10"
        />
        <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"/>
      </div>
    </form>
      </div>
      <div className="flex items-center justify-center sm:justify-start  w-full h-16 mt-3 b-4  pl-4 sm:pl-10">
        <span className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl font-serif">
          Recommended Recipes
        </span>
      </div>
      <div className=" grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full  pl-2 pr-6 ">
        {!loading &&
          recipes.map(({ recipe }, index) => (
            <Card key={index} recipe={recipe} {...getRandomColor()} />
          ))}

        {loading &&
          [...Array(9)].map((_, index) => (
            <div key={index} className="flex flex-col gap-4 w-full">
              <div className="skeleton h-32 w-full"></div>
              <div className="flex justify-between">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
