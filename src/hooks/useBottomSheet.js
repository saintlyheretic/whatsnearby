import { useEffect, useRef, useState } from 'react';

export function useBottomSheet(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e) => {
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
      sheet.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      const deltaY = e.touches[0].clientY - startY.current;
      currentY.current = e.touches[0].clientY;

      // Determine if we should prevent scrolling
      const isAtTop = sheet.scrollTop <= 0;
      if (isAtTop && deltaY > 0) {
        e.preventDefault();
      }

      // Update sheet position
      if (isAtTop) {
        sheet.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleTouchEnd = () => {
      sheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      sheet.style.transform = '';

      const deltaY = currentY.current - startY.current;
      
      // If dragged more than 100px or flicked quickly, toggle state
      if (Math.abs(deltaY) > 100) {
        setIsExpanded(deltaY < 0);
      }
    };

    // Handle click on the handle bar
    const handleClick = (e) => {
      if (e.target.closest('.handle-bar')) {
        setIsExpanded(!isExpanded);
      }
    };

    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove);
    sheet.addEventListener('touchend', handleTouchEnd);
    sheet.addEventListener('click', handleClick);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
      sheet.removeEventListener('click', handleClick);
    };
  }, [isExpanded]);

  return [isExpanded, setIsExpanded, sheetRef];
}
