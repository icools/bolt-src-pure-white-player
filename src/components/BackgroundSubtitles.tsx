import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Subtitle } from '../types';

interface BackgroundSubtitlesProps {
  subtitles: Subtitle[];
  currentIndex: number;
}

const BackgroundSubtitles: React.FC<BackgroundSubtitlesProps> = ({ subtitles, currentIndex }) => {
  const [backgroundSubtitles, setBackgroundSubtitles] = useState<JSX.Element[]>([]);
  const controls = useAnimation();

  const createBackgroundSubtitles = useCallback(() => {
    const elements = subtitles
      .filter((_, index) => index !== currentIndex)
      .map((subtitle, index) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.2 + 0.1;
        const fontSize = Math.random() * 1 + 0.8;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: `${x}vw`, y: `${y}vh` }}
            animate={controls}
            transition={{ 
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              position: 'absolute',
              left: `${x}vw`,
              top: `${y}vh`,
              fontSize: `${fontSize}rem`,
              color: `rgba(255, 255, 255, ${opacity})`,
              textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
              maxWidth: '30vw',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle.text}
          </motion.div>
        );
      });
    setBackgroundSubtitles(elements);
  }, [subtitles, currentIndex, controls]);

  useEffect(() => {
    createBackgroundSubtitles();

    controls.start((i) => {
      if (i && typeof i.opacity === 'number' && typeof i.left === 'string' && typeof i.top === 'string') {
        return {
          opacity: [i.opacity, i.opacity + 0.1, i.opacity],
          x: [`${i.left}`, `calc(${i.left} + 2vw)`, `${i.left}`],
          y: [`${i.top}`, `calc(${i.top} + 2vh)`, `${i.top}`],
        };
      }
      return {};
    });

    const handleResize = () => {
      createBackgroundSubtitles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createBackgroundSubtitles, controls]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {backgroundSubtitles}
    </div>
  );
};

export default BackgroundSubtitles;