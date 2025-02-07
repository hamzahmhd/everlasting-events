"use client";

import { useState, useEffect } from "react";
import { Booking } from "@prisma/client";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import HomeIcon from "@/components/HomeIcon";

export default function AdminDashboard() {
  type BookingWithUser = Booking & {
    User: { name: string; email: string };
  };

  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/admin/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings.");
        const data: BookingWithUser[] = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchBookings();
  }, []);

  async function approveBooking(bookingId: number) {
    try {
      const response = await fetch("/api/admin/bookings/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Failed to approve booking.");

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
      alert("Booking approved successfully!");
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  }

  async function rejectBooking() {
    if (!currentBookingId) return;

    try {
      const response = await fetch("/api/admin/bookings/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: currentBookingId, reason: rejectionReason }),
      });

      if (!response.ok) throw new Error("Failed to reject booking.");

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== currentBookingId)
      );

      setShowModal(false);
      setCurrentBookingId(null);
      setRejectionReason("");
      alert("Booking rejected successfully!");
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-[#23272A] p-8 text-white">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-6"> {/* Increased spacing */}
          <div className="flex items-center">
            <HomeIcon className="text-teal-500 hover:text-teal-700 w-8 h-8" />
          </div>
          <h1
            className="text-3xl font-[500] mt-4"
            style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}
          >
            Admin Dashboard
          </h1>
        </header>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-gray-900 shadow-md rounded-lg border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {[
                  "ID",
                  "Event Type",
                  "Event Date",
                  "Consultation Date",
                  "Location",
                  "Budget",
                  "Description",
                  "Phone Number",
                  "User Info",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-700 px-4 py-3 text-left font-medium text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-800 transition duration-200">
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">{booking.id}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">{booking.eventType}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">
                      {new Date(booking.eventDate).toLocaleString()}
                    </td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">
                      {new Date(booking.consultationDate).toLocaleString()}
                    </td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">{booking.location}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">${booking.budget}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">{booking.description || "N/A"}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">{booking.phoneNumber || "N/A"}</td>
                    <td className="border border-gray-700 px-4 py-3 text-gray-300">
                      {booking.User?.name || "N/A"} <br />
                      {booking.User?.email || "N/A"}
                    </td>
                    <td className="border border-gray-700 px-4 py-3">
                      <button
                        className="bg-teal-600 text-white px-4 py-2 rounded mr-2 hover:bg-teal-500 font-circular"
                        onClick={() => approveBooking(booking.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-[#800020] text-white px-4 py-2 rounded hover:bg-[#660017] font-circular"
                        onClick={() => {
                          setCurrentBookingId(booking.id);
                          setShowModal(true);
                        }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-400">
                    No pending bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rejection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded shadow-lg w-1/3 text-white">
              <h2 className="text-xl font-bold mb-4">Reject Booking</h2>
              <textarea
                className="w-full border border-gray-600 rounded p-2 mb-4 bg-gray-900 text-white"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500 font-circular"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#800020] text-white px-4 py-2 rounded hover:bg-[#660017] font-circular"
                  onClick={rejectBooking}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtectedRoute>
  );
}


