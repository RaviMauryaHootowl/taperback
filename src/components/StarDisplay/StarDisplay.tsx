import React, {useState,useEffect} from 'react';
import styles from './StarDisplay.module.css';
import starFull from '../../images/star_full.svg';
import starHalf from '../../images/star_half.svg';
import starFullEmpty from '../../images/star_full_empty.svg';

const StarDisplay:React.FC<{value: number, size: string}> = ({value, size}) => {

  const [stars, setStars] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    getStars();
  }, [value])

  const starImage = (isFull : number) : JSX.Element => {
    if(isFull === 0){
      return (<img className={styles.star} height={size} width={size} src={starFull} alt=""/>);
    }else if(isFull === 1){
      return (<img className={styles.star} height={size} width={size} src={starHalf} alt=""/>);
    }else{
      return (<img className={styles.star} height={size} width={size} src={starFullEmpty} alt=""/>);
    }
  }

  const getStars = () => {
    let stars : Array<JSX.Element> = [];
    const floorvalue = Math.floor(value);
    for(let i = 0; i < floorvalue; i++){
      stars.push(starImage(0));
    }
    let remainStars = 5 - floorvalue;
    if(remainStars > 0){
      stars.push(starImage(1));
      remainStars--;
    }
    for(let i = 0; i < remainStars; i++){
      stars.push(starImage(2));
    }
    setStars(stars);
  }

  return (
    <div className={styles.starContainer}>
      {
        stars.map((star, index) => {
          return (star);
        })
      }
    </div>
  );
}

export default StarDisplay;

