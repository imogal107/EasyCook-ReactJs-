
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Card from "../components/Card";
import { getRandomColor } from "../lib/utils";
import Fuse from "fuse.js";

// Letters a–z used to fetch all meals from TheMealDB by first letter
const ALPHABET = [..."abcdefghijklmnopqrstuvwxyz"];

// Session storage key for caching
const STORAGE_KEY = "allRecipesCache";
// How long cache should be considered valid (in hours)
const CACHE_EXPIRY_HOURS = 24;

/* ----------------------- Cache Helper Functions ----------------------- */

// Check if cached timestamp is still valid
const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  const now = Date.now();
  const diffHours = (now - timestamp) / (1000 * 60 * 60);
  return diffHours <= CACHE_EXPIRY_HOURS;
};

// Save recipes to sessionStorage with timestamp
const saveCache = (recipes) => {
  if (typeof window === "undefined") return; // safety for SSR environments

  const payload = {
    data: recipes,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to save cache:", err);
  }
};

// Load recipes from sessionStorage if valid
const loadCache = () => {
  if (typeof window === "undefined") return null; // safety for SSR

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (!parsed || !Array.isArray(parsed.data)) return null;

    if (!isCacheValid(parsed.timestamp)) return null;

    return parsed.data;
  } catch (err) {
    console.error("Failed to read cache:", err);
    return null;
  }
};

/* ----------------------------- Component ------------------------------ */

const HomePage = () => {
  // All recipes fetched from API or cache (source data)
  const [allRecipes, setAllRecipes] = useState([]);
  // Recipes currently displayed (after fuzzy search)
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Raw value from the search input
  const [searchTerm, setSearchTerm] = useState("");
  // Debounced value used for actual searching
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Fetch ALL recipes from TheMealDB using first-letter endpoint
  const fetchAllRecipes = async () => {
    setLoading(true);
    setRecipes([]);

    try {
      let allMeals = [];

      // Fetch for each letter a–z
      for (const letter of ALPHABET) {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
        );
        const data = await res.json();
        const meals = data.meals || [];
        allMeals = [...allMeals, ...meals];
      }

      // Remove duplicates by idMeal, just in case
      const uniqueMeals = Array.from(
        new Map(allMeals.map((meal) => [meal.idMeal, meal])).values()
      );

      // Update state
      setAllRecipes(uniqueMeals);
      setRecipes(uniqueMeals);

      // Cache result in sessionStorage for this session
      saveCache(uniqueMeals);

      return uniqueMeals;
    } catch (error) {
      console.error("Failed to fetch recipes:", error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial load: try cache first; if not present/valid, fetch from API
  useEffect(() => {
    const init = async () => {
      const cachedMeals = loadCache();

      if (cachedMeals && cachedMeals.length > 0) {
        setAllRecipes(cachedMeals);
        setRecipes(cachedMeals);
        setLoading(false);
        return; // use cache, skip network
      }

      // If no cache / invalid cache, fetch fresh
      await fetchAllRecipes();
    };

    init();
  }, []);

  // Debounce searchTerm → debouncedSearchTerm (runs Fuse less frequently)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // cleanup on change/unmount
  }, [searchTerm]);

  // Fuzzy search with Fuse.js whenever debouncedSearchTerm or allRecipes change
  useEffect(() => {
    // If search is empty, show all recipes
    if (!debouncedSearchTerm.trim()) {
      setRecipes(allRecipes);
      return;
    }

    const fuse = new Fuse(allRecipes, {
      keys: ["strMeal", "strCategory", "strArea", "strTags"],
      threshold: 0.4, // lower = stricter, higher = fuzzier
    });

    const result = fuse.search(debouncedSearchTerm).map((r) => r.item);
    setRecipes(result);
  }, [debouncedSearchTerm, allRecipes]);

  // We already handle search via onChange; submit just prevents page reload
  const handleSearchRecipe = (e) => {
    e.preventDefault();
  };

  const showNoResults =
    !loading && debouncedSearchTerm.trim() && recipes.length === 0;

  return (
    <div className="flex-1 bg-slate-100 w-full min-h-screen items-center lg:pl-20 lg:pr-20">
      {/* Search bar */}
      <div className="flex items-center justify-center w-full h-10 mt-16 mb-4">
        <form
          className="flex items-center gap-2 w-full ml-10 mr-10 relative cursor-pointer"
          onSubmit={handleSearchRecipe}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Recipes..."
              className="input text-lg font-serif input-sm input-bordered border-slate-600 rounded w-full h-10 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </form>
      </div>

      {/* Section title */}
      <div className="flex items-center justify-center sm:justify-start w-full h-16 mt-3 pl-4 sm:pl-10">
        <span className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl font-serif">
          Recommended Recipes
        </span>
      </div>

      {/* Cards grid / skeletons / empty state */}
      <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full pl-2 pr-6">
        {/* Loading skeletons */}
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

        {/* No results state */}
        {showNoResults && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-slate-600">
            <p className="text-lg font-semibold mb-1">No recipes found</p>
            <p className="text-sm">
              Try a different keyword like &quot;chicken&quot;, &quot;pasta&quot; or
              &quot;indian&quot;.
            </p>
          </div>
        )}

        {/* Recipe cards */}
        {!loading &&
          recipes.map((meal, index) => (
            <Card
              key={meal.idMeal || index}
              recipe={meal}
              {...getRandomColor()}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePage;

