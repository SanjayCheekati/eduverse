import { motion } from 'framer-motion';

const GlowOrbs = () => {
  const orbs = [
    { color: 'from-primary-500/20 to-purple-500/20', size: 'w-96 h-96', pos: 'top-0 left-0', delay: 0 },
    { color: 'from-purple-500/15 to-pink-500/15', size: 'w-[500px] h-[500px]', pos: 'top-1/4 right-0', delay: 2 },
    { color: 'from-cyan-500/10 to-primary-500/10', size: 'w-80 h-80', pos: 'bottom-0 left-1/4', delay: 4 },
    { color: 'from-neon-pink/10 to-neon-purple/10', size: 'w-72 h-72', pos: 'bottom-1/4 right-1/4', delay: 6 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.pos} ${orb.size} bg-gradient-radial ${orb.color} rounded-full blur-3xl`}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

export default GlowOrbs;
