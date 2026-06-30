import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-[hsl(0,0%,2%)] relative overflow-hidden font-sans antialiased">
      
      {/* Giant outlined watermark — behind everything */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <motion.h1 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="text-[18vw] font-black outline-text tracking-tighter whitespace-nowrap"
        >
          SyntriX
        </motion.h1>
      </div>

      {/* Left Panel — Branding (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden md:flex w-1/2 flex-col justify-between p-12 z-10 border-r border-white/5 relative"
      >
        {/* Logo */}
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <img src={logoImg} alt="Syntrix" className="h-24 object-contain" />
        </Link>

        {/* Tagline */}
        <div>
          <h3 className="text-5xl font-light leading-tight mb-6 text-white">
            Intelligence <br />
            <span className="font-bold">Redefined.</span>
          </h3>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
            Advanced Security Information and Event Management.
            Engineered for precision, built for scale.
          </p>
        </div>

        {/* Bottom credit */}
        <div className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">
          The First Egyptian SIEM Solution
        </div>
      </motion.div>

      {/* Right Panel — Form content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="w-full md:w-1/2 flex items-center justify-center p-8 z-10 relative"
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
