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
        <div className="w-1/2 bg-gradient-to-r from-gray-300 to-transparent p-10 h-full flex flex-col justify-center rounded-3xl">
          <h2 className="text-4xl font-semibold mb-3 leading-normal">
            Everyone can be <br /> a Chef in their own kitchen
          </h2>
          <p className="text-lg font-normal mb-5 w-[500px]">
            Mastering the kitchen is all about the right tips and tricks. A
            pinch of patience, a dash of creativity, and smart shortcuts can
            elevate any dish. Let every mistake be a lesson, and every trick a
            secret to flavor.
          </p>
          <Link className="bg-black text-white w-fit rounded-3xl p-3">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TipsSection;
