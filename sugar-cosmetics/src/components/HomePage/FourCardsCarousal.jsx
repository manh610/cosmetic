import Carousel from 'react-bootstrap/Carousel';
import CardCarousel from './CardCarousel';



function FourCardsCarousel({BestSellersData}) {
  return (
    <Carousel variant="dark" slide={false} border="1px solid red">
      <Carousel.Item>
        <div className='CardCrousel'>
        <CardCarousel src1={BestSellersData[0].image_link} text={BestSellersData[0].name} price={BestSellersData[0].price}/>
        <CardCarousel src1={BestSellersData[1].image_link} text={BestSellersData[1].name} price={BestSellersData[1].price}/>
        <CardCarousel src1={BestSellersData[2].image_link} text={BestSellersData[2].name} price={BestSellersData[2].price}/>
        <CardCarousel src1={BestSellersData[3].image_link} text={BestSellersData[3].name} price={BestSellersData[3].price}/>
        </div>
      
      </Carousel.Item>

      <Carousel.Item>
      <div className='CardCrousel'>
        <CardCarousel src1={BestSellersData[4].image_link} text={BestSellersData[4].name} price={BestSellersData[4].price}/>
        <CardCarousel src1={BestSellersData[2].image_link} text={BestSellersData[5].name} price={BestSellersData[5].price}/>
        <CardCarousel src1={BestSellersData[6].image_link} text={BestSellersData[6].name} price={BestSellersData[6].price}/>
        <CardCarousel src1={BestSellersData[7].image_link} text={BestSellersData[7].name} price={BestSellersData[7].price}/>
        </div>
      </Carousel.Item>

      <Carousel.Item>
      <div className='CardCrousel'>
        <CardCarousel src1={BestSellersData[8].image_link} text={BestSellersData[8].name} price={BestSellersData[8].price}/>
        <CardCarousel src1={BestSellersData[9].image_link} text={BestSellersData[9].name} price={BestSellersData[9].price}/>
        <CardCarousel src1={BestSellersData[10].image_link} text={BestSellersData[10].name} price={BestSellersData[10].price}/>
        <CardCarousel src1={BestSellersData[11].image_link} text={BestSellersData[11].name} price={BestSellersData[11].price}/>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default FourCardsCarousel;