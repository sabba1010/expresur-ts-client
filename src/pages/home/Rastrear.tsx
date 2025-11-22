import React from "react";
import rastrearImg from "../../assets/rastrear.png";

const Rastrear = () => {
  return (
    <div className="w-full" style={{ maxWidth: "1673px", margin: "0 auto" }}>
      <section className="w-full px-6 lg:px-20 py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div>
          <h1 className="text-5xl font-bold text-orange-500 leading-tight">
            Rastrear <br /> paquete
          </h1>

          <p className="text-gray-600 mt-6 max-w-md">
            rápidos, económicos y seguros Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt
            ut laoreet dolore magna aliquam erat volutpat.
          </p>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Número de rastreo"
              className="w-full lg:w-80 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button className="mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition">
              RASTREAR
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={rastrearImg}
            alt="Tracking Illustration"
            className="w-full max-w-lg"
          />
        </div>

      </section>
    </div>
  );
};

export default Rastrear;
