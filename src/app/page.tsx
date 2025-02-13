"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <header className="fixed top-0 w-full bg-[#23272A] text-white h-[58px] px-16 flex justify-between items-center shadow-md z-50 backdrop-blur-md font-circular">

        <Link href="/">
          <Image src="/logo3.png" alt="Everlasting Events Logo" width={101} height={19} className="h-auto w-auto" />
        </Link>
        <nav className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-white">
            <FaUser size={14} /> {/* Further reduced icon size */}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#23272A] rounded-md shadow-md text-white z-50 font-circular text-[15px] font-medium">
              {user ? (
                <>
                  <p className="p-2 border-b">Welcome, {user.name}</p>
                  
                  {/* Show Admin Dashboard Link for Admin Users Only */}
                  {user.role === "admin" && (
                    <Link href="/api/admin/dashboard" className="block p-2 hover:bg-gray-700">
                      Admin Dashboard
                    </Link>
                  )}

                  <button onClick={logout} className="p-2 w-full text-left hover:bg-gray-700">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block p-2 hover:bg-gray-700">Login</Link>
                  <Link href="/register" className="block p-2 hover:bg-gray-700">Register</Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[650px] flex items-center justify-center text-center text-white mt-[58px]">
        <Image src="/galleryhero.jpg" alt="Event Decor" layout="fill" objectFit="cover" className="absolute z-0" />
        <div className="relative z-10">
          <h1 className="text-[56px] font-[500] leading-[60px] font-serif" style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}>
            Welcome to Everlasting Events
          </h1>
          <p className="text-lg max-w-2xl mx-auto mt-2 font-circular">
            Your trusted partner for unforgettable event decor and rentals. Let us help make your special day truly memorable.
          </p>
        </div>
      </section>

      {/* Client Inquiries Section */}
      <section className="py-16 bg-gray-100 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          {/* Left-aligned Title */}
          <h3 className="text-4xl font-[500] text-black md:w-1/2 mb-4 md:mb-0" style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}>
            Client Inquiries
          </h3>
          {/* Right-aligned Content */}
          <div className="md:w-1/2 text-gray-700 text-lg font-circular">
            <p className="mb-6">
              {user ? "Fill out this form to book a free phone consultation and discuss the details of your event."
                : "Register or log in to book a phone consultation and discuss the details of your event."}
            </p>
            {user ? (
              <Link href="/booking" className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-500">
                Book a Consultation
              </Link>
            ) : (
              <Link href="/register" className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-500">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white text-center">
        <h3 className="text-4xl font-[500] text-black mb-6" style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}>
          About Us
        </h3>
        <p className="text-gray-700 max-w-3xl mx-auto font-circular">
          At Everlasting Events, we specialize in creating memorable experiences with our premium decor and rental services. Whether it's a wedding, birthday, 
          or corporate event, we bring your vision to life with style and elegance.
        </p>
      </section>

   {/* Gallery Section */}
<section className="py-16 bg-gray-100 text-center">
  <h3
    className="text-4xl font-[500] text-black mb-6"
    style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}
  >
    Gallery
  </h3>
  <p className="text-gray-700 mb-8 font-circular">
    Check out some of our amazing past events:
  </p>

  {/* Masonry Layout */}
  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 px-8">
    {[
      "gallery1.jpg",
      "gallery2.jpg",
      "gallery3.jpg",
      "gallery4.JPG",
      "gallery5.JPG",
      "gallery6.JPG",
      "gallery7.JPG",
      "gallery8.JPG",
      "gallery9.JPG",
      "gallery10.JPG",
      "gallery11.JPG",
      "gallery12.JPG",
      "gallery13.JPG",
      "gallery14.JPG",
    ].map((img, index) => (
      <div key={index} className="mb-4 break-inside-avoid rounded-lg shadow-md overflow-hidden">
        <Image
          src={`/${img}`}
          alt={`Event ${index + 1}`}
          width={500} // Consistent width
          height={0} // Auto height
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    ))}
  </div>
</section>



      {/* Footer */}
      <footer className="bg-[#23272A] text-white py-8 text-center">
        <h3 className="text-lg font-bold mb-4 font-circular">Contact Us</h3>
        <p className="font-circular">
          Email: <a href="mailto:mail.everlastingevents@gmail.com" className="underline">mail.everlastingevents@gmail.com</a>
        </p>
        <p className="font-circular">
          Instagram: <a href="https://instagram.com/everlastingevents.ca" target="_blank" rel="noopener noreferrer" className="underline">@everlastingevents.ca</a>
        </p>
      </footer>
    </div>
  );
}
