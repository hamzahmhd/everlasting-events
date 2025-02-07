"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HomeIcon from "@/components/HomeIcon";

export default function BookingPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [unavailableSlots, setUnavailableSlots] = useState<
    { start: Date; end: Date }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const initialValues = {
    eventType: "",
    eventDate: "",
    consultationDate: null,
    location: "",
    budget: "",
    description: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    eventType: Yup.string().required("Event Type is required"),
    eventDate: Yup.string().required("Event Date is required"),
    consultationDate: Yup.date().required("Consultation Date is required"),
    location: Yup.string().required("Location is required"),
    budget: Yup.number()
      .min(1, "Budget must be at least 1")
      .required("Budget is required"),
    description: Yup.string().required("Description is required"),
    phoneNumber: Yup.string()
      .matches(
        /^(\+1\s?)?(\(\d{3}\)|\d{3})([-.\s]?)\d{3}([-.\s]?)\d{4}$/,
        "Phone number must be valid (e.g., 514-xxx-xxxx, (438) xxx-xxxx)"
      )
      .required("Phone number is required"),
  });

  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      try {
        const response = await fetch("/api/calendar/availability");
        if (!response.ok) throw new Error("Failed to fetch availability");
        const data = await response.json();
  
        console.log("Fetched unavailable slots from API:", data); // Debugging
  
        setUnavailableSlots(
          data.map((event: any) => ({
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      } catch (err) {
        console.error("Error fetching availability:", err);
        setError("Failed to load unavailable slots.");
      } finally {
        setLoadingSlots(false);
      }
    };
  
    fetchUnavailableSlots();
  }, []);
  

  const isSlotAvailable = (date: Date) => {
    return unavailableSlots.every((slot) => {
      const slotStart = new Date(slot.start).getTime();
      const slotEnd = new Date(slot.end).getTime();
      const selectedTime = date.getTime();
  
      // Ensure the selected time is NOT within an unavailable slot
      return selectedTime < slotStart || selectedTime >= slotEnd;
    });
  };
  


  

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#23272A] p-4">
        {/* Home Button */}
        <HomeIcon className="text-teal-500 hover:text-teal-700 mb-6 w-8 h-8" />

        {/* Title */}
        <h1
          className="text-3xl font-[500] text-white mb-6"
          style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}
        >
          Book a Phone Consultation
        </h1>

        {/* Status Messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (!user?.id) {
                setError("User not authenticated.");
                setSubmitting(false);
                return;
              }

              const payload = { ...values, userId: user.id };

              const response = await fetch("/api/booking", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Something went wrong.");
              }

              setSuccess("Booking request submitted successfully!");
              setTimeout(() => router.push("/"), 2000);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "An unknown error occurred."
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="flex flex-col gap-4 w-full max-w-md">
              {/* Event Type */}
              <Field
                type="text"
                name="eventType"
                placeholder="Event Type (e.g., Wedding, Birthday)"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="eventType" component="div" className="text-red-500 text-sm" />

              {/* Event Date */}

              <DatePicker
                selected={values.eventDate ? new Date(values.eventDate) : null}
                onChange={(date) => {
                  setFieldValue("eventDate", date?.toISOString().split("T")[0]); // Store as YYYY-MM-DD
                }}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="MMMM d, yyyy"
                placeholderText="Select Event Date"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="eventDate" component="div" className="text-red-500 text-sm" />


              {/* Consultation Date & Time */}
              <DatePicker
  selected={values.consultationDate}
  onChange={(date) => setFieldValue("consultationDate", date)}
  showTimeSelect
  timeIntervals={30}
  dateFormat="MMMM d, yyyy h:mm aa"
  minDate={new Date()}
  filterTime={isSlotAvailable} // Ensure blocked times are grayed out
  className="w-full border p-2 rounded bg-white text-black font-circular"
  placeholderText="Select Consultation Date & Time"
/>

              <ErrorMessage name="consultationDate" component="div" className="text-red-500 text-sm" />

              {/* Phone Number */}
              <Field
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />

              {/* Event Location */}
              <Field
                type="text"
                name="location"
                placeholder="Event Location"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />

              {/* Budget */}
              <Field
                type="number"
                name="budget"
                placeholder="Budget (CAD)"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="budget" component="div" className="text-red-500 text-sm" />

              {/* Description */}
              <Field
                as="textarea"
                name="description"
                placeholder="Provide a brief description of your event..."
                rows="4"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-500 font-circular"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </ProtectedRoute>
  );
}

