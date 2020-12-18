import React from 'react';
import {Link} from 'react-router-dom';
import styles from './HeroSection.module.css';
import heroImage from '../../images/heroimage.png';
import heroImageSmall from '../../images/heroimagesmall.png';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useWindowSize from '../../ResizeHook';

const HeroSection = () => {

  const size = useWindowSize();

  return (
    <div className={styles.heroContainer}>
      <Carousel autoPlay className={styles.carousel} showArrows={true} showThumbs={false} showStatus={false}>
        <div>
          <img className={styles.herobgImage} src={(size.width && size.width < 600) ? heroImageSmall : heroImage} alt=""/>
        </div>
        <div>
          <img className={styles.herobgImage} src={(size.width && size.width < 600) ? heroImageSmall : heroImage} alt=""/>
        </div>
        <div>
          <img className={styles.herobgImage} src={(size.width && size.width < 600) ? heroImageSmall : heroImage} alt=""/>
        </div>
      </Carousel>
    </div>
  );
}

export default HeroSection;