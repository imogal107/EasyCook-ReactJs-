import Card from "../components/Card";

const FavouritesPage = () => {
  const rawFavourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // remove duplicates by idMeal
  const favourites = Array.from(
    new Map(rawFavourites.map((m) => [m.idMeal, m])).values()
  );
  console.log("Favorites : " , favourites);
  

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
          {favourites.map((meal, index) => (
            <Card
              key={meal.idMeal || index}
              recipe={meal}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavouritesPage;
