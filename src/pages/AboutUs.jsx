import React from "react";

const AboutUs = () => {
  return (
    <div className="flex justify-center">
      <div id="webcrumbs">
        <div className="w-[800px] min-h-[600px] bg-neutral-50 shadow-lg rounded-lg p-8">
          <header className="mb-6 text-center">
            <h1 className="text-4xl font-title text-primary">About Us</h1>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg">
              Welcome to RecipeBook, your trusted companion in the kitchen. We
              started with a passion for cooking and a desire to make home
              cooking easy, enjoyable, and delicious for everyone.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg">
              At RecipeBook, we believe that cooking should be fun, accessible,
              and rewarding. Our mission is to inspire home cooks by providing a
              wide variety of delicious, easy-to-follow recipes from all
              cuisines of the world.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc ml-5 text-lg">
              <li className="mb-2">
                Step-by-step recipes tested by professionals.
              </li>
              <li className="mb-2">
                Nutrition facts and tips for healthy eating.
              </li>
              <li className="mb-2">Curated meal plans and weekly specials.</li>
              <li className="mb-2">
                A community of cooking enthusiasts to share your experiences
                with.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-primary">
                <i className="fa-brands fa-facebook w-[40px] h-[40px]"></i>
              </a>
              <a href="#" className="text-primary">
                <i className="fa-brands fa-instagram w-[40px] h-[40px]"></i>
              </a>
              <a href="#" className="text-primary">
                <i className="fa-brands fa-twitter w-[40px] h-[40px]"></i>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
