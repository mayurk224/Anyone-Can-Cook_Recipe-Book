import React from "react";

const SocialMediaPost = () => {
  return (
    <div className="my-12">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-4xl font-semibold">
          Checkout out @anyone_can_cook on{" "}
          <span className="bg-gradient-to-t from-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Instagram
          </span>
        </h1>
        <p className="text-lg text-gray-700 w-[700px] text-center">
          Every recipe tells a story, a blend of flavors and memories shared.
          Post yours today and inspire the world, one dish at a time.
        </p>
      </div>

      <div className="postContainer flex items-center justify-center h-64  rounded-lg mt-8">
        <h1 className="text-xl font-medium text-gray-600">
          This section will be Live Soon
        </h1>
      </div>
    </div>
  );
};

export default SocialMediaPost;
