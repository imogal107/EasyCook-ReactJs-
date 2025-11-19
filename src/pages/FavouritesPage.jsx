import React from "react";
import Card from "../components/Card";
import { getRandomColor } from "../lib/utils";

const FavouritesPage = () => {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  return (
    <div className=" flex-1 p-10 min-h-screen bg-slate-200">
      <div className=" max-w-screen-lg mx-auto">
        <p className=" p-4 text-3xl md:text-5xl font-bold">My Favourites</p>
        {favourites.length === 0 && (
          <div className="flex flex-col items-center gap-4 h-[70vh]">
            <img src="/404.svg" alt="404 image" className="h-3/4" />
          </div>
        )} 
          <div className="border-2 grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full  pl-2 pr-6 ">
            {
              favourites.map((recipe)=>(
                <Card key={recipe.label} recipe={recipe} {...getRandomColor()}/>               
              ))
            }
          </div>
       
      </div>
    </div>
  );
};

export default FavouritesPage;
