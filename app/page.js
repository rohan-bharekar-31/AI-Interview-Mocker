"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Use replace() to avoid adding to history stack
  }, [router]);

  return null;
};

export default Home;

