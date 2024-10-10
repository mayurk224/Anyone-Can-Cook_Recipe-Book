import React from "react";

const SocialMediaPost = () => {
  return (
    <div className="my-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 items-center text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Checkout @anyone_can_cook on{" "}
          <span className="bg-gradient-to-t from-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Instagram
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          Every recipe tells a story, a blend of flavors and memories shared.
          Post yours today and inspire the world, one dish at a time.
        </p>
      </div>

      <div className="postContainer flex items-center justify-center h-48 sm:h-56 md:h-64 bg-gray-100 rounded-lg mt-8">
        <h1 className="text-lg sm:text-xl font-medium text-gray-600">
          This section will be Live Soon
        </h1>
      </div>
    </div>
  );
};

export default SocialMediaPost;
