import { useEffect, useState } from "react";
import FourCardsCarousel from "./FourCardsCarousal";
import TitleForall from "./TitleForall";
import { Giftingdata } from "./giftingdata";
import ProductService from "../../app/service/product.service";
import BestsellersCardCarousel from "./BestsellersCardCarousal";

export default function Gifting() {
  const [giftingData, setGiftingData] = useState([]);
  useEffect(() => {
    ProductService.search({
      pageIndex: 1,
      pageSize: 4
    }).then((res) => {
      console.log("res", res);
      setGiftingData([...res.data].sort(() => Math.random() - 0.5));
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <>
      <TitleForall titlename={"GIFTING"} />
      {/* <FourCardsCarousel BestSellersData={giftingData} /> */}
      <BestsellersCardCarousel BestSellersData={giftingData} />
    </>
  );
}
