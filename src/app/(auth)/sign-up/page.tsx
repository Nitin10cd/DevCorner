"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "USER" | "RECRUITER") => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-zinc-100 dark:bg-zinc-800"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-zinc-100 dark:bg-zinc-800"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-zinc-100 dark:bg-zinc-800"
        />

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="role"
              value="USER"
              checked={form.role === "USER"}
              onChange={() => handleRoleChange("USER")}
            />
            <span>User</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="role"
              value="RECRUITER"
              checked={form.role === "RECRUITER"}
              onChange={() => handleRoleChange("RECRUITER")}
            />
            <span>Recruiter</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-zinc-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}
