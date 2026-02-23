import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-emerald-500/50">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to VetEMR to manage records seamlessly</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mb-6 p-4 bg-rose-500/10 border left-rose-500/50 border-rose-500/40 text-rose-400 rounded-xl text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="doctor@vet.clinic"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70 flex items-center shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
