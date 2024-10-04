import React from "react";

const ContactUs = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div id="webcrumbs">
        <div className="w-[800px] min-h-[600px] bg-neutral-50 shadow rounded-lg p-8">
          <h1 className="text-4xl font-title mb-8 text-center">Contact Us</h1>

          <div className="flex flex-wrap gap-8">
            {/* Left section: Contact Information */}
            <div className="w-[350px]">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-6">
                If you have any questions, feel free to reach out to us. We're
                here to help!
              </p>

              <div className="mb-4">
                <h3 className="font-bold">Email</h3>
                <p>contact@ourwebsite.com</p>
              </div>

              <div className="mb-4">
                <h3 className="font-bold">Phone</h3>
                <p>+123 456 7890</p>
              </div>

              <div className="mb-4">
                <h3 className="font-bold">Address</h3>
                <p>123 Business St. Suite 456, City, Country</p>
              </div>

              <div className="flex gap-4 mt-6">
                <a href="#" className="text-primary">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="text-primary">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" className="text-primary">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Right section: Contact Form */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>

              <form className="space-y-4">
                <div>
                  <label className="block font-bold mb-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full p-2 border rounded-md"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Your message"
                  />
                </div>

                <button
                  className="bg-primary text-white px-6 py-2 rounded-md"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
