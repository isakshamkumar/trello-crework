"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(`${initialMode} submitted:`, formData);
  };


const handleAuthMode = () => {
  router.push(initialMode === 'login' ? '/signup' : '/login');
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFDFF] to-[#B4A8FE] flex items-center justify-center">
      <div className="bg-[#F6F6F6] py-16 px-11 rounded-lg shadow-md w-full h-fit max-w-[34rem]">
        <h1 className="text-4xl text-black text-center font-semibold mb-6">Welcome to <span className="text-[#4534AC]">Workflo</span>!</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {initialMode === 'signup' && (
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 text-slate-700 font-normal bg-[#EBEBEB] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-3 text-slate-700 font-normal bg-[#EBEBEB] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 text-slate-700 font-normal bg-[#EBEBEB] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#766ABE] text-white py-2 rounded-md mt-6 hover:bg-[#3A2A9E] transition duration-300"
          >
            {initialMode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>
        <p className="text-center mt-8 text-base text-gray-600">
          {initialMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={handleAuthMode}
            className="text-blue-600 text- hover:underline focus:outline-none"
          >
            {initialMode === 'login' ? 'Create a new account' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;