import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import CardCarousel from "./CardCarousel";

function BestsellersCardCarousel({ BestSellersData }) {
  console.log("BestSellersData", BestSellersData);
  return (
    <>
      <Carousel slide={false} className="bestseller_carousal">
        <Carousel.Item>
          <div  className="CardCrousel">
            {BestSellersData.slice(0,4).map((item) => (
              <CardCarousel
                key={item.id}
                src1={`data:image/jpeg;base64,${item.photo}`}
                text={item.name}
                prod_id={item.id}
                price={item.minPrice}
              />
            ))}
          </div>
        </Carousel.Item>

        {/* <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[4].image_link}
              prod_id={BestSellersData[4].id}
              text={BestSellersData[4].name}
              price={BestSellersData[4].price}
            />
            <CardCarousel
              src1={BestSellersData[2].image_link}
              prod_id={BestSellersData[5].id}
              text={BestSellersData[5].name}
              price={BestSellersData[5].price}
            />
            <CardCarousel
              src1={BestSellersData[6].image_link}
              prod_id={BestSellersData[6].id}
              text={BestSellersData[6].name}
              price={BestSellersData[6].price}
            />
            <CardCarousel
              src1={BestSellersData[7].image_link}
              prod_id={BestSellersData[7].id}
              text={BestSellersData[7].name}
              price={BestSellersData[7].price}
            />
          </div>
        </Carousel.Item> */}

        {/* <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[8].image_link}
              prod_id={BestSellersData[8].id}
              text={BestSellersData[8].name}
              price={BestSellersData[8].price}
            />
            <CardCarousel
              src1={BestSellersData[9].image_link}
              prod_id={BestSellersData[9].id}
              text={BestSellersData[9].name}
              price={BestSellersData[9].price}
            />
            <CardCarousel
              src1={BestSellersData[10].image_link}
              prod_id={BestSellersData[10].id}
              text={BestSellersData[10].name}
              price={BestSellersData[10].price}
            />
            <CardCarousel
              src1={BestSellersData[11].image_link}
              prod_id={BestSellersData[11].id}
              text={BestSellersData[11].name}
              price={BestSellersData[11].price}
            />
          </div>
        </Carousel.Item> */}
      </Carousel>

      {/* <Carousel slide={false} className="CardCrousel_Ipad">
        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[0].image_link}
              text={BestSellersData[0].name}
              prod_id={BestSellersData[0].id}
              price={BestSellersData[0].price}
            />
            <CardCarousel
              src1={BestSellersData[1].image_link}
              text={BestSellersData[1].name}
              prod_id={BestSellersData[1].id}
              price={BestSellersData[1].price}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[4].image_link}
              prod_id={BestSellersData[4].id}
              text={BestSellersData[4].name}
              price={BestSellersData[4].price}
            />
            <CardCarousel
              src1={BestSellersData[2].image_link}
              prod_id={BestSellersData[5].id}
              text={BestSellersData[5].name}
              price={BestSellersData[5].price}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[8].image_link}
              prod_id={BestSellersData[8].id}
              text={BestSellersData[8].name}
              price={BestSellersData[8].price}
            />
            <CardCarousel
              src1={BestSellersData[9].image_link}
              prod_id={BestSellersData[9].id}
              text={BestSellersData[9].name}
              price={BestSellersData[9].price}
            />
          </div>
        </Carousel.Item>
      </Carousel> */}

      {/* <Carousel slide={false} className="CardCrousel_mobile">
        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[0].image_link}
              text={BestSellersData[0].name}
              prod_id={BestSellersData[0].id}
              price={BestSellersData[0].price}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[4].image_link}
              prod_id={BestSellersData[4].id}
              text={BestSellersData[4].name}
              price={BestSellersData[4].price}
            />
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="CardCrousel">
            <CardCarousel
              src1={BestSellersData[8].image_link}
              prod_id={BestSellersData[8].id}
              text={BestSellersData[8].name}
              price={BestSellersData[8].price}
            />
          </div>
        </Carousel.Item>
      </Carousel> */}
    </>
  );
}

export default BestsellersCardCarousel;
