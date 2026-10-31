import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        toast.error(error.response.data.errors[0].msg);
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <input name="name" type="text" required className="input-field" placeholder="Full Name" onChange={handleChange} />
            </div>
            <div>
              <input name="email" type="email" required className="input-field" placeholder="Email address" onChange={handleChange} />
            </div>
            <div>
              <input name="phone" type="tel" required className="input-field" placeholder="Phone Number" onChange={handleChange} />
            </div>
            <div>
              <input name="password" type="password" required className="input-field" placeholder="Password" onChange={handleChange} />
            </div>
            <div>
              <input name="confirmPassword" type="password" required className="input-field" placeholder="Confirm Password" onChange={handleChange} />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2">
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
