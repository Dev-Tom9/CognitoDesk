// frontend/src/hooks/useCountingAnimation.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook to animate a number count-up effect.
 * @param finalValue The target number to count up to.
 * @param duration The duration of the animation in milliseconds.
 * @returns The current animated number.
 */
export const useCountingAnimation = (finalValue: number, duration: number = 2000): number => {
    const [count, setCount] = useState(0);
    const startValue = 0;
    const startTime = performance.now();

    useEffect(() => {
        if (finalValue <= 0) return; // Prevent animation if target is zero or less

        let animationFrame: number;

        const animateCount = (currentTime: number) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1); // Clamp progress between 0 and 1

            // Easing function: ease-out quad for a smooth, natural deceleration
            const easedProgress = 1 - Math.pow(1 - progress, 2);

            // Calculate the current value
            const currentValue = startValue + easedProgress * (finalValue - startValue);

            // We use Math.floor to ensure integer counting for non-decimal values
            setCount(Math.floor(currentValue));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animateCount);
            }
        };

        animationFrame = requestAnimationFrame(animateCount);

        // Cleanup function to stop animation when component unmounts
        return () => cancelAnimationFrame(animationFrame);
    }, [finalValue, duration]);

    // Return the final value once the animation is complete (handles static end state)
    // If we've reached the final value (or passed it), return the final value exactly.
    return count;
};