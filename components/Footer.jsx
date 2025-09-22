import React from "react";

const Footer = () => {
  return (
    <footer className="bg-surfaceMuted border-t border-lightBorderColor px-4">
      <div className="max-w-[1200px] mx-auto py-10">
        <div className="flex flex-wrap gap-4">
          <div className="my-6 lg:m-0 w-full md:w-[calc(100%/2-20px)] lg:w-[calc(100%/3-20px)] xl:w-[calc(100%/4-20px)]">
            <h1 className="text-md font-semibold mb-4 text-blackColor">
              Guest services
            </h1>
            <ul>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Help Center
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Travel insurance
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Safety information
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Inclusive travel support
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Cancellation options
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Local wellness updates
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Report a neighborhood concern
              </li>
            </ul>
          </div>
          <div className="my-6 lg:m-0 w-full md:w-[calc(100%/2-20px)] lg:w-[calc(100%/3-20px)] xl:w-[calc(100%/4-20px)]">
            <h1 className="text-md font-semibold mb-4 text-blackColor">Community</h1>
            <ul>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                EasyStay Cares
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Support local artisans
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Combating discrimination
              </li>
            </ul>
          </div>
          <div className="my-6 lg:m-0 w-full md:w-[calc(100%/2-20px)] lg:w-[calc(100%/3-20px)] xl:w-[calc(100%/4-20px)]">
            <h1 className="text-md font-semibold mb-4 text-blackColor">
              Partnering
            </h1>
            <ul>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Become an EasyStay host
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Host assurance program
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Explore hosting resources
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Visit our partner forum
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                How to host responsibly
              </li>
            </ul>
          </div>
          <div className="my-6 lg:m-0 w-full md:w-[calc(100%/2-20px)] lg:w-[calc(100%/3-20px)] xl:w-[calc(100%/4-20px)]">
            <h1 className="text-md font-semibold mb-4 text-blackColor">Company</h1>
            <ul>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Newsroom
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Learn about new features
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Letter from our founders
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Careers
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Investors
              </li>
              <li className="my-2 hover:underline cursor-pointer text-lightTextColor text-sm block py-1 md:p-0">
                Gift cards
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
