"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import HomeIcon from "@/components/HomeIcon";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: { name: string; email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        router.push("/login"); // Redirect to login page on successful registration
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#23272A] p-4">
      {/* Home Icon */}
      <HomeIcon className="text-teal-500 hover:text-teal-700 mb-6 w-8 h-8" />

      {/* Title */}
      <h1
        className="text-3xl font-[500] text-white mb-6"
        style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}
      >
        Register
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-full max-w-sm">
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-2 rounded bg-white text-black font-circular"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-500 font-circular"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Login Link */}
      <p className="mt-4 text-gray-400 font-circular">
        Already have an account?{" "}
        <button
          className="text-teal-500 hover:underline"
          onClick={() => router.push("/login")}
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
