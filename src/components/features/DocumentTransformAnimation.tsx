import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles, Brain, Lightbulb, Upload, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResourcePosition {
  icon: React.ReactNode;
  label: string;
  x: number;
  y: number;
  index: number;
}

const DocumentTransformAnimation = () => {
  const [animationState, setAnimationState] = useState('initial');
  const [showUploadText, setShowUploadText] = useState(true);
  const [cycle, setCycle] = useState(0);

  // Animation sequence controller
  useEffect(() => {
    const animationSequence = async () => {
      // Reset animation
      setAnimationState('initial');
      setShowUploadText(true);
      
      // Wait before starting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Document floats up
      setAnimationState('documentRise');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Document transforms into resources
      setAnimationState('transform');
      setShowUploadText(false);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Resources settle and show benefits
      setAnimationState('showBenefits');
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Increment cycle for key changes
      setCycle(prev => prev + 1);
    };

    // Start animation sequence
    animationSequence();
    
    // Set up animation loop
    const intervalId = setInterval(animationSequence, 12000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Animation variants for the document
  const documentVariants = {
    initial: { y: 30, opacity: 0, scale: 0.8 },
    documentRise: { 
      y: -20, 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 1.2, 
        ease: "easeOut",
        y: { type: "spring", stiffness: 300, damping: 15 }
      } 
    },
    transform: { 
      y: -20, 
      opacity: 0, 
      scale: 1.5, 
      transition: { 
        duration: 0.5,
        opacity: { duration: 0.3 },
        scale: { type: "spring", stiffness: 200, damping: 10 }
      } 
    },
    showBenefits: { opacity: 0 }
  };

  // Animation variants for the resource icons
  const resourceVariants = {
    initial: { opacity: 0, scale: 0, rotate: -45 },
    documentRise: { opacity: 0, scale: 0 },
    transform: (custom: ResourcePosition) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      x: custom.x,
      y: custom.y,
      transition: { 
        delay: 0.3 + (custom.index * 0.15), 
        duration: 0.7, 
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }),
    showBenefits: (custom: ResourcePosition) => ({
      opacity: 1,
      scale: 1.05,
      x: custom.x,
      y: custom.y,
      transition: { 
        delay: 0.1, 
        duration: 0.3,
        yoyo: Infinity,
        repeatDelay: 2
      }
    })
  };

  // Animation variants for the benefit labels
  const labelVariants = {
    initial: { opacity: 0, y: 10 },
    documentRise: { opacity: 0, y: 10 },
    transform: { opacity: 0, y: 10 },
    showBenefits: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.5 + (custom * 0.2), 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  // Animation variants for the glow effect
  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    documentRise: { 
      opacity: 0.4, 
      scale: 1.2, 
      transition: { duration: 1.5 } 
    },
    transform: { 
      opacity: [0.4, 0.8, 0.4], 
      scale: [1.2, 1.8, 1.2],
      transition: { 
        duration: 2, 
        times: [0, 0.5, 1],
        ease: "easeInOut" 
      } 
    },
    showBenefits: { 
      opacity: 0.5, 
      scale: 2,
      transition: { duration: 1 } 
    }
  };

  const uploadTextVariants = {
    initial: { opacity: 0 },
    documentRise: { 
      opacity: 1, 
      transition: { delay: 0.3, duration: 0.5 } 
    },
    transform: { opacity: 0, transition: { duration: 0.3 } },
    showBenefits: { opacity: 0 }
  };

  const benefitTextVariants = {
    initial: { opacity: 0, y: 20 },
    documentRise: { opacity: 0, y: 20 },
    transform: { opacity: 0, y: 20 },
    showBenefits: { 
      opacity: 1,
      y: 0,
      transition: { 
        delay: 1.2, 
        duration: 0.8, 
        type: "spring",
        stiffness: 100,
        damping: 10
      } 
    }
  };

  // Particle effect
  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    documentRise: { opacity: 0, scale: 0 },
    transform: (custom: number) => ({ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      transition: {
        delay: 0.3 + Math.random() * 0.5,
        duration: 1.5,
        times: [0, 0.4, 1]
      }
    }),
    showBenefits: { opacity: 0 }
  };

  // Resource positions with new icons
  const resourcePositions: ResourcePosition[] = [
    { icon: <Sparkles className="h-12 w-12 text-amber-500" />, label: "Personalized Questions", x: -100, y: -80, index: 0 },
    { icon: <Brain className="h-12 w-12 text-blue-500" />, label: "AI-Enhanced Learning", x: 100, y: -80, index: 1 },
    { icon: <BookOpen className="h-12 w-12 text-green-500" />, label: "Study Materials", x: -100, y: 80, index: 2 },
    { icon: <Lightbulb className="h-12 w-12 text-purple-500" />, label: "Knowledge Synthesis", x: 100, y: 80, index: 3 }
  ];

  // Generate particles for the transformation animation
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg p-6 h-[450px] relative overflow-hidden">
      <motion.h4 
        className="text-lg font-medium mb-6 text-gradient font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI-Powered Transformation
      </motion.h4>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Background glow effect */}
        <motion.div 
          className="absolute rounded-full bg-gradient-to-r from-primary/30 to-brand-lightBlue/30 blur-2xl"
          style={{ width: 200, height: 200 }}
          variants={glowVariants}
          animate={animationState}
          key={`glow-${cycle}`}
        />
        
        {/* Particles for the transformation effect */}
        {animationState === 'transform' && particles.map((p, i) => (
          <AnimatePresence key={`particle-${i}-${cycle}`}>
            <motion.div
              className="absolute rounded-full bg-primary/70 w-2 h-2"
              variants={particleVariants}
              custom={i}
              animate="transform"
              initial="initial"
              exit={{ opacity: 0 }}
            />
          </AnimatePresence>
        ))}
        
        {/* Original document */}
        <motion.div 
          className="absolute flex flex-col items-center"
          variants={documentVariants}
          animate={animationState}
          key={`doc-${cycle}`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 relative border border-gray-200 dark:border-gray-700">
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ 
                duration: 5, 
                ease: "easeInOut", 
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <BookOpen className="h-14 w-14 text-primary" />
            </motion.div>
            <motion.div 
              className="absolute -top-8 whitespace-nowrap font-medium text-sm bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-textContent-DEFAULT dark:text-textContent-dark"
              variants={uploadTextVariants}
              animate={animationState}
            >
              {showUploadText && (
                <div className="flex items-center">
                  Transform Your Materials
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
        
        {/* Resource icons with labels */}
        {resourcePositions.map((resource, index) => (
          <React.Fragment key={`resource-${index}-${cycle}`}>
            <motion.div 
              className="absolute flex flex-col items-center z-20"
              custom={resource}
              variants={resourceVariants}
              animate={animationState}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 relative z-10 border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {resource.icon}
              </motion.div>
              
              <motion.div 
                className="mt-2 text-xs font-medium bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                custom={index}
                variants={labelVariants}
                animate={animationState}
              >
                {resource.label}
              </motion.div>
            </motion.div>
          </React.Fragment>
        ))}
        
        {/* Tagline at the bottom */}
        <motion.div 
          className="absolute bottom-[10px] text-center w-[250px] mx-auto font-medium bg-gradient-to-r from-primary to-brand-lightBlue px-3 py-2 rounded-lg text-white shadow-md z-30"
          variants={benefitTextVariants}
          animate={animationState}
          key={`benefit-${cycle}`}
        >
          <div className="text-sm">
            One upload, endless study resources. 
            <span className="block mt-1">Learn smarter, not harder.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentTransformAnimation;
