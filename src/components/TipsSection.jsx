import React from "react";
import { Link } from "react-router-dom";

const TipsSection = () => {
  return (
    <div className="my-24">
      <div
        className="rounded-3xl"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          width: "100%",
        }}
      >
        <div className="w-full sm:w-3/4 lg:w-1/2 bg-gradient-to-r from-gray-300 to-transparent p-6 sm:p-8 md:p-10 h-full flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 leading-normal">
            Everyone can be <br /> a Chef in their own kitchen
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-normal mb-5 w-full sm:w-[400px] lg:w-[500px]">
            Mastering the kitchen is all about the right tips and tricks. A
            pinch of patience, a dash of creativity, and smart shortcuts can
            elevate any dish. Let every mistake be a lesson, and every trick a
            secret to flavor.
          </p>
          <Link className="bg-black text-white w-fit rounded-3xl px-4 py-2 sm:px-5 sm:py-3">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
