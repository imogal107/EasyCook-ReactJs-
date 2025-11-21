
// import React, { useEffect, useState } from "react";
// import { IoSearchSharp } from "react-icons/io5";
// import Card from "../components/Card";
// import { getRandomColor } from "../lib/utils";
// import Fuse from "fuse.js";

// // Letters a–z used to fetch all meals from TheMealDB by first letter
// const ALPHABET = [..."abcdefghijklmnopqrstuvwxyz"];

// // Session storage key for caching
// const STORAGE_KEY = "allRecipesCache";
// // How long cache should be considered valid (in hours)
// const CACHE_EXPIRY_HOURS = 24;

// /* ----------------------- Cache Helper Functions ----------------------- */

// // Check if cached timestamp is still valid
// const isCacheValid = (timestamp) => {
//   if (!timestamp) return false;
//   const now = Date.now();
//   const diffHours = (now - timestamp) / (1000 * 60 * 60);
//   return diffHours <= CACHE_EXPIRY_HOURS;
// };

// // Save recipes to sessionStorage with timestamp
// const saveCache = (recipes) => {
//   if (typeof window === "undefined") return; // safety for SSR environments

//   const payload = {
//     data: recipes,
//     timestamp: Date.now(),
//   };

//   try {
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
//   } catch (err) {
//     console.error("Failed to save cache:", err);
//   }
// };

// // Load recipes from sessionStorage if valid
// const loadCache = () => {
//   if (typeof window === "undefined") return null; // safety for SSR

//   try {
//     const cached = sessionStorage.getItem(STORAGE_KEY);
//     if (!cached) return null;

//     const parsed = JSON.parse(cached);
//     if (!parsed || !Array.isArray(parsed.data)) return null;

//     if (!isCacheValid(parsed.timestamp)) return null;

//     return parsed.data;
//   } catch (err) {
//     console.error("Failed to read cache:", err);
//     return null;
//   }
// };

// /* ----------------------------- Component ------------------------------ */

// const HomePage = () => {
//   // All recipes fetched from API or cache (source data)
//   const [allRecipes, setAllRecipes] = useState([]);
//   // Recipes currently displayed (after fuzzy search)
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Raw value from the search input
//   const [searchTerm, setSearchTerm] = useState("");
//   // Debounced value used for actual searching
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   // Fetch ALL recipes from TheMealDB using first-letter endpoint
//   const fetchAllRecipes = async () => {
//     setLoading(true);
//     setRecipes([]);

//     try {
//       let allMeals = [];

//       // Fetch for each letter a–z
//       for (const letter of ALPHABET) {
//         const res = await fetch(
//           `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
//         );
//         const data = await res.json();
//         const meals = data.meals || [];
//         allMeals = [...allMeals, ...meals];
//       }

//       // Remove duplicates by idMeal, just in case
//       const uniqueMeals = Array.from(
//         new Map(allMeals.map((meal) => [meal.idMeal, meal])).values()
//       );

//       // Update state
//       setAllRecipes(uniqueMeals);
//       setRecipes(uniqueMeals);

//       // Cache result in sessionStorage for this session
//       saveCache(uniqueMeals);

//       return uniqueMeals;
//     } catch (error) {
//       console.error("Failed to fetch recipes:", error.message);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load: try cache first; if not present/valid, fetch from API
//   useEffect(() => {
//     const init = async () => {
//       const cachedMeals = loadCache();

//       if (cachedMeals && cachedMeals.length > 0) {
//         setAllRecipes(cachedMeals);
//         setRecipes(cachedMeals);
//         setLoading(false);
//         return; // use cache, skip network
//       }

//       // If no cache / invalid cache, fetch fresh
//       await fetchAllRecipes();
//     };

//     init();
//   }, []);

//   // Debounce searchTerm → debouncedSearchTerm (runs Fuse less frequently)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500); // 500ms debounce delay

//     return () => clearTimeout(timer); // cleanup on change/unmount
//   }, [searchTerm]);

//   // Fuzzy search with Fuse.js whenever debouncedSearchTerm or allRecipes change
//   useEffect(() => {
//     // If search is empty, show all recipes
//     if (!debouncedSearchTerm.trim()) {
//       setRecipes(allRecipes);
//       return;
//     }

//     const fuse = new Fuse(allRecipes, {
//       keys: ["strMeal", "strCategory", "strArea", "strTags"],
//       threshold: 0.4, // lower = stricter, higher = fuzzier
//     });

//     const result = fuse.search(debouncedSearchTerm).map((r) => r.item);
//     setRecipes(result);
//   }, [debouncedSearchTerm, allRecipes]);

//   // We already handle search via onChange; submit just prevents page reload
//   const handleSearchRecipe = (e) => {
//     e.preventDefault();
//   };

//   const showNoResults =
//     !loading && debouncedSearchTerm.trim() && recipes.length === 0;

//   return (
//     <div className="flex-1 bg-slate-100 w-full min-h-screen items-center lg:pl-20 lg:pr-20">
//       {/* Search bar */}
//       <div className="flex items-center justify-center w-full h-10 mt-16 mb-4">
//         <form
//           className="flex items-center gap-2 w-full ml-10 mr-10 relative cursor-pointer"
//           onSubmit={handleSearchRecipe}
//         >
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search Recipes..."
//               className="input text-lg font-serif input-sm input-bordered border-slate-600 rounded w-full h-10 pl-10"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
//           </div>
//         </form>
//       </div>

//       {/* Section title */}
//       <div className="flex items-center justify-center sm:justify-start w-full h-16 mt-3 pl-4 sm:pl-10">
//         <span className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl font-serif">
//           Recommended Recipes
//         </span>
//       </div>

//       {/* Cards grid / skeletons / empty state */}
//       <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full pl-2 pr-6">
//         {/* Loading skeletons */}
//         {loading &&
//           [...Array(9)].map((_, index) => (
//             <div key={index} className="flex flex-col gap-4 w-full">
//               <div className="skeleton h-32 w-full"></div>
//               <div className="flex justify-between">
//                 <div className="skeleton h-4 w-28"></div>
//                 <div className="skeleton h-4 w-24"></div>
//               </div>
//               <div className="skeleton h-4 w-1/2"></div>
//             </div>
//           ))}

//         {/* No results state */}
//         {showNoResults && (
//           <div className="col-span-full flex flex-col items-center justify-center py-10 text-center text-slate-600">
//             <p className="text-lg font-semibold mb-1">No recipes found</p>
//             <p className="text-sm">
//               Try a different keyword like &quot;chicken&quot;, &quot;pasta&quot; or
//               &quot;indian&quot;.
//             </p>
//           </div>
//         )}

//         {/* Recipe cards */}
//         {!loading &&
//           recipes.map((meal, index) => (
//             <Card
//               key={meal.idMeal || index}
//               recipe={meal}
//               {...getRandomColor()}
//             />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;



import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { IoSearchSharp } from "react-icons/io5";
import Card from "../components/Card";
import Fuse from "fuse.js";

// Letters a–z used to lazily fetch meals from TheMealDB by first letter
const ALPHABET = [..."abcdefghijklmnopqrstuvwxyz"];

// Session storage key for caching lazy-loaded data
const STORAGE_KEY = "lazyRecipesCache";
// How long cache should be considered valid (in hours) – extra safety
const CACHE_EXPIRY_HOURS = 24;

/* ----------------------- Cache Helper Functions ----------------------- */

// Check if cached timestamp is still valid
const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  const now = Date.now();
  const diffHours = (now - timestamp) / (1000 * 60 * 60);
  return diffHours <= CACHE_EXPIRY_HOURS;
};

// Save recipes + state to sessionStorage with timestamp
const saveCache = (recipes, currentLetterIndex) => {
  if (typeof window === "undefined") return; // safety for SSR

  const payload = {
    data: recipes,
    currentLetterIndex,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to save cache:", err);
  }
};

// Load recipes + state from sessionStorage if valid
const loadCache = () => {
  if (typeof window === "undefined") return null; // safety for SSR

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (!parsed || !Array.isArray(parsed.data)) return null;

    if (!isCacheValid(parsed.timestamp)) return null;

    return {
      data: parsed.data,
      currentLetterIndex: parsed.currentLetterIndex ?? 0,
    };
  } catch (err) {
    console.error("Failed to read cache:", err);
    return null;
  }
};

/* ----------------------------- Component ------------------------------ */

const HomePage = () => {
  // All recipes loaded so far (from API or cache)
  const [allRecipes, setAllRecipes] = useState([]);
  // Recipes currently displayed (after fuzzy search)
  const [recipes, setRecipes] = useState([]);
  // Loading state for any network call
  const [loading, setLoading] = useState(false);

  // Which letter index we’ve loaded up to (0 = 'a', 1 = 'b', etc.)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  // Whether there are more letters to load
  const [hasMore, setHasMore] = useState(true);

  // Raw value from the search input
  const [searchTerm, setSearchTerm] = useState("");
  // Debounced value used for actual searching
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Sentinel div for infinite scroll
  const sentinelRef = useRef(null);

  // Lazily load recipes for the next letter in ALPHABET
  const loadMoreRecipes = useCallback(async () => {
    // No more letters left
    if (currentLetterIndex >= ALPHABET.length) {
      setHasMore(false);
      return;
    }

    // Prevent multiple parallel loads
    if (loading) return;

    setLoading(true);
    const letter = ALPHABET[currentLetterIndex];

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
      );
      const data = await res.json();
      const meals = data.meals || [];

      // Append new meals while removing duplicates by idMeal
      const combined = [...allRecipes, ...meals];
      const uniqueMeals = Array.from(
        new Map(combined.map((meal) => [meal.idMeal, meal])).values()
      );

      const nextIndex = currentLetterIndex + 1;

      setAllRecipes(uniqueMeals);

      // If there is no active search term, show all loaded recipes
      if (!debouncedSearchTerm.trim()) {
        setRecipes(uniqueMeals);
      }

      setCurrentLetterIndex(nextIndex);
      setHasMore(nextIndex < ALPHABET.length);

      // Save updated state in session cache
      saveCache(uniqueMeals, nextIndex);
    } catch (error) {
      console.error("Failed to load recipes:", error.message);
    } finally {
      setLoading(false);
    }
  }, [allRecipes, currentLetterIndex, debouncedSearchTerm, loading]);

  // Initial load: try session cache first; otherwise load the first letter
  useEffect(() => {
    const init = async () => {
      const cached = loadCache();

      if (cached && cached.data.length > 0) {
        setAllRecipes(cached.data);
        setRecipes(cached.data);
        setCurrentLetterIndex(cached.currentLetterIndex);
        setHasMore(cached.currentLetterIndex < ALPHABET.length);
        setLoading(false);
        return; // use cache, skip network
      }

      // No valid cache → load first letter
      await loadMoreRecipes();
    };

    init();
  }, [loadMoreRecipes]);

  // Debounce searchTerm → debouncedSearchTerm (runs Fuse less frequently)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fuzzy search with Fuse.js over currently loaded recipes
  useEffect(() => {
    // If search is empty, show all loaded recipes
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

  // Infinite scroll: watch the sentinel div, load more when it enters viewport
  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMoreRecipes();
        }
      },
      {
        root: null, // viewport
        rootMargin: "200px", // start loading a bit before reaching bottom
        threshold: 0,        // any intersection triggers it
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loadMoreRecipes]);

  // Prevent big skeletons after first load
  const isInitialLoad = allRecipes.length === 0 && loading;

  const showNoResults =
    !loading && debouncedSearchTerm.trim() && recipes.length === 0;

  // We already handle search via onChange; submit just prevents page reload
  const handleSearchRecipe = (e) => {
    e.preventDefault();
  };

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
        {/* Initial loading skeletons */}
        {isInitialLoad &&
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

        {/* No results state (for search) */}
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
        {!isInitialLoad &&
          recipes.map((meal, index) => (
            <Card
              key={meal.idMeal || index}
              recipe={meal}
            />
          ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-10 w-full" />

      {/* Bottom status text */}
      {!isInitialLoad && loading && (
        <p className="text-center text-sm text-slate-500 my-4">
          Loading more recipes...
        </p>
      )}

      {!loading && !hasMore && allRecipes.length > 0 && (
        <p className="text-center text-xs text-slate-500 my-4">
          You&apos;ve reached the end of available recipes.
        </p>
      )}
    </div>
  );
};

export default HomePage;
