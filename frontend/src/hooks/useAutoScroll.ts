import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for auto-scrolling functionality
 * Automatically scrolls to bottom when new items are added
 * Stops auto-scrolling when user manually scrolls up
 */
export const useAutoScroll = <T>(items: T[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevItemsLengthRef = useRef(items.length);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    
    setShouldAutoScroll(isAtBottom);
  };

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (shouldAutoScroll && containerRef.current && items.length > prevItemsLengthRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    prevItemsLengthRef.current = items.length;
  }, [items, shouldAutoScroll]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return containerRef;
}; 