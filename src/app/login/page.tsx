"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import HomeIcon from "@/components/HomeIcon";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.token); // Use AuthContext login
      } else {
        const data = await response.json();
        setError(data.error || "Invalid credentials");
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

      {/* Login Title */}
      <h1 className="text-3xl font-[500] text-white mb-6" style={{ fontFamily: "Garamond Premier Pro, Times New Roman, serif" }}>
        Login
      </h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-full max-w-sm">
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

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md font-circular hover:bg-teal-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Register Link */}
      <p className="mt-4 text-gray-400 font-circular">
        Don’t have an account?{" "}
        <button className="text-teal-500 hover:underline font-circular" onClick={() => router.push("/register")}>
          Register here
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
