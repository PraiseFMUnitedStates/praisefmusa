
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LOGO_URL } from '../constants';

interface SignInViewProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const SignInView: React.FC<SignInViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const signIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
    else onLoginSuccess();
    setLoading(false);
  };

  const signUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) alert(error.message);
    else alert('Account created successfully 🙌');
    setLoading(false);
  };

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const signInApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <div className="min-h-[85vh] bg-white flex flex-col items-center pt-16 pb-24 px-4">
      <div className="max-w-sm w-full space-y-10">
        <div className="text-center">
          <div className="flex justify-center mb-8">
             <div className="flex flex-col items-center">
                <img src={LOGO_URL} alt="Praise FM USA" className="h-16 w-auto object-contain mb-4" />
                <span className="font-black text-2xl tracking-tighter text-black uppercase">PRAISE ID</span>
             </div>
          </div>
          <h2 className="text-4xl font-normal text-black tracking-tight mb-3">
            {isSignUp ? 'Create Account' : 'Praise FM USA Login'}
          </h2>
          <p className="text-gray-500 text-base font-normal leading-relaxed">
            {isSignUp 
              ? 'Join our community of listeners and save your favorite Praise FM USA sounds.' 
              : 'Sign in with your Praise ID to access your personal sounds and favorites.'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={isSignUp ? signUp : signIn}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-normal uppercase tracking-[0.2em] text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="appearance-none relative block w-full px-4 py-4 border-2 border-gray-100 placeholder-gray-400 text-black focus:outline-none focus:border-praise-orange focus:ring-0 sm:text-base font-normal transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-normal uppercase tracking-[0.2em] text-gray-500 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-4 py-4 border-2 border-gray-100 placeholder-gray-400 text-black focus:outline-none focus:border-praise-orange focus:ring-0 sm:text-base font-normal transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            {!isSignUp ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent text-sm font-normal uppercase tracking-[0.3em] text-white bg-praise-orange hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent text-sm font-normal uppercase tracking-[0.3em] text-white bg-black hover:bg-praise-orange transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-xs font-normal text-gray-400 uppercase tracking-widest hover:text-praise-orange transition-colors py-2"
            >
              {isSignUp ? 'Back to Login' : 'Create an Account'}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-normal">
            <span className="px-4 bg-white text-gray-300">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={signInGoogle}
            className="w-full inline-flex justify-center py-4 px-4 border-2 border-gray-100 bg-white text-[10px] font-normal text-gray-800 uppercase tracking-widest hover:border-praise-orange transition-colors"
          >
            Google
          </button>
          <button 
            onClick={signInApple}
            className="w-full inline-flex justify-center py-4 px-4 border-2 border-gray-100 bg-white text-[10px] font-normal text-gray-800 uppercase tracking-widest hover:border-praise-orange transition-colors"
          >
            Apple
          </button>
        </div>

        <div className="mt-12 text-center">
           <button 
             onClick={onCancel}
             className="text-[10px] font-normal text-gray-400 hover:text-black uppercase tracking-[0.3em] transition-colors"
           >
              Return to Radio
           </button>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
