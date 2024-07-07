
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = () => {
    const handleSearch = () =>{
        console.log("Search Icon Clicked")
    }
  return (
    <form className="flex items-center gap-2 w-full ml-10 mr-10 relative cursor-pointer">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Recipes.."
          className="input text-lg font-serif input-sm  input-bordered border-slate-600 rounded w-full h-10 pl-10"
        />
        <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" onClick={handleSearch}/>
      </div>
    </form>
  );
};

export default SearchInput;
