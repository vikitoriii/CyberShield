import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function GlitchLogo() {
  return (
    <div className="glitch-logo-container">
      <motion.div
        className="glitch-logo"
        animate={{
          textShadow: [
            '2px 0 #ff4d4d, -2px 0 #4d94ff',
            '-2px 0 #ff4d4d, 2px 0 #4d94ff',
            '2px 2px #ff4d4d, -2px -2px #4d94ff',
            '0 0 #ff4d4d, 0 0 #4d94ff',
            '2px 0 #ff4d4d, -2px 0 #4d94ff',
          ]
        }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
      >
        <Shield color="#00ff41" size={24} />
        <span className="glitch-text-main">CS-OS</span>
      </motion.div>
      <div className="glitch-version">v1.0.5</div>
    </div>
  );
}
