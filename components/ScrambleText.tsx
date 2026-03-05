
import { FC, useState, useRef, useEffect } from 'react';

export const ScrambleText: FC<{ text: string }> = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const isAnimating = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const runFullScramble = () => {
      isAnimating.current = true;
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char: string, index: number) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text);
          isAnimating.current = false;
          scheduleNext();
        }
        iteration += 1 / 4;
      }, 40);
    };

    const runPartialGlitch = () => {
      isAnimating.current = true;
      const numCharsToGlitch = Math.floor(Math.random() * 2) + 1;
      const indicesToGlitch = new Set<number>();
      while (indicesToGlitch.size < numCharsToGlitch) {
        indicesToGlitch.add(Math.floor(Math.random() * text.length));
      }

      let ticks = 0;
      const maxTicks = Math.floor(Math.random() * 5) + 4;

      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          text.split('').map((char: string, index: number) => {
            if (indicesToGlitch.has(index)) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return text[index];
          }).join('')
        );
        ticks++;
        if (ticks >= maxTicks) {
          clearInterval(interval);
          setDisplayText(text);
          isAnimating.current = false;
          scheduleNext();
        }
      }, 40);
    };

    const scheduleNext = () => {
      if (isAnimating.current) return;
      const nextDelay = Math.random() * 17000 + 8000;
      timeout = setTimeout(() => {
        if (Math.random() < 0.15) {
          runFullScramble();
        } else {
          runPartialGlitch();
        }
      }, nextDelay);
    };

    runFullScramble();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text]);

  return <>{displayText}</>;
};
