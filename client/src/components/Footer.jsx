import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 w-full text-gray-500 mt-20 bg-white">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-300 pb-10">
        {/* Left: Logo + Description */}
        <div className="md:max-w-md">
          <img className="h-9" src={assets.syn} alt="QuickAi Logo" />
          <p className="mt-6 text-sm leading-relaxed">
            Experience the power of AI with <strong>Synapse AI</strong>. <br />
            Transform your content creation with our suite of premium AI tools:
            write articles, generate images, and enhance your workflow.
          </p>
        </div>

        {/* Right: Links + Newsletter */}
        <div className="flex-1 flex flex-col sm:flex-row gap-10 justify-between">
          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-4 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm mb-4 max-w-xs">
              Get the latest AI tools, updates, and tips delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="border border-gray-300 text-sm placeholder-gray-500 focus:ring-2 ring-primary outline-none w-full max-w-64 h-9 rounded px-3"
                required
              />
              <button
                type="submit"
                className="bg-primary w-24 h-9 text-white rounded text-sm hover:bg-primary/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-xs text-gray-400">
        Made by <strong>Sohail</strong>
      </p>
    </footer>
  );
};

export default Footer;
