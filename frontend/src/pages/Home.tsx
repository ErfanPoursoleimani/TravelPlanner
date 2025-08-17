import React from 'react';
import Commercial from '../components/Home/Commercial';
import Main from '../components/Home/Main';
import PopularDestinations from '../components/Home/PopularDestinations';
import TripPlanner from '../components/Home/TripPlanner';
import AnimatedBox from '../components/AnimatedBox';


const Home: React.FC = () => {


  return (
    <div className="min-h-screen flex flex-col space-y-17">
      <Main />

      <AnimatedBox>
        <TripPlanner />
      </AnimatedBox>

      <AnimatedBox threshold={0.3} animation='slideUp' rootMargin='10px'>
        <PopularDestinations />
      </AnimatedBox>

      <AnimatedBox threshold={0.3} animation='slideUp' rootMargin='10px'>
        <Commercial />
      </AnimatedBox>

      <div>

      </div>
    </div>
  );
};

export default Home;