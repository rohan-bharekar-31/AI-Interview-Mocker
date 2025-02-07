"use client"; // Ensure it's a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Use replace() to avoid adding to history stack
  }, [router]);

  return null;
};

export default Home;

