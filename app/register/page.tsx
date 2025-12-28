"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    age: "",
    occupation: "",
    phone: "",
    city: "",
    hobbies: "",
    password: "",
  });

  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          loading: false,
          message: "✅ User registered successfully!",
        });
        setFormData({
          name: "",
          userId: "",
          age: "",
          occupation: "",
          phone: "",
          city: "",
          hobbies: "",
          password: "",
        });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
    } catch (err: any) {
      setStatus({ loading: false, message: `❌ Error: ${err.message}` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hobbies
            </label>
            <textarea
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              status.loading
                ? "bg-indigo-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {status.loading ? "Registering..." : "Sign Up"}
          </button>

          {status.message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                status.message.includes("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
