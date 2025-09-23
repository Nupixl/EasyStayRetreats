import axios from "axios";
import { useEffect, useState } from "react";
import PostBody from "./body";
import Categories from "./categories";

const Posts = () => {
  const [categories, setCategories] = useState({
    loading: true,
    data: [],
    error: null,
  });

  const [listings, setListings] = useState({
    loading: true,
    data: [],
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setListings({ loading: true, data: [], error: null });
        setCategories({ loading: true, data: [], error: null });

        const { data } = await axios("/api/properties");
        if (data.success) {
          setListings({ loading: false, data: data.data, error: null });
        } else {
          setListings({ loading: false, data: [], error: data.error });
        }

        const { data: categoryData } = await axios("/api/categories");
        setCategories({ loading: false, data: categoryData.data, error: null });
      } catch (error) {
        const message =
          error.response?.data?.error ||
          error.message ||
          "Unable to load retreats right now.";
        console.error("Property feed failed:", message);
        setListings({
          loading: false,
          data: [],
          error:
            "We couldn't load retreats right now. Please verify the Supabase setup.",
        });
        setCategories({ loading: false, data: [], error: null });
      }
    })();
  }, []);

  return (
    <div className="w-full min-h-screen">
      <Categories data={categories} />
      <div className="w-full xl:container mx-auto py-2 lg:py-8">
        <PostBody data={listings} />
      </div>
    </div>
  );
};

export default Posts;
