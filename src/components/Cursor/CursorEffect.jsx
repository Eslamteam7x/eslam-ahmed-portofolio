import { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      if (follower) {
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
      }
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    animate();

    const links = document.querySelectorAll('a, button, .btn, input, textarea');
    links.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor?.classList.add('active');
        follower?.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('active');
        follower?.classList.remove('active');
      });
    });

    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
