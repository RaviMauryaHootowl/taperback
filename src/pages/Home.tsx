import React from 'react';
import Footer from '../components/Footer/Footer';
import BookSection from '../components/HomeBookSection/BookSection';
import HeroSection from '../components/HomeHero/HeroSection';

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <BookSection/>
      <Footer/>
    </div>
  );
}

export default Home;
