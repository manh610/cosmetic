import BestsellersCardCarousel from "./BestsellersCardCarousal";
import FourCardsCarousel from "./FourCardsCarousal";
import TitleForall from "./TitleForall";
import ProductService from "../../app/service/product.service";
import { useEffect, useState } from "react";

export default function Skincare() {
  const [skincareData, setSkincareData] = useState([]);
  useEffect(() => {
    ProductService.search({}).then((res) => {
      console.log("res", res);
      setSkincareData(res.data);
    }).catch((err) => {
      console.log(err);
      });
  }, []);
  return (
    <>
      <TitleForall titlename={"SKINCARE"} />
      {/* <FourCardsCarousel BestSellersData={BestSellersData} /> */}
      <BestsellersCardCarousel BestSellersData={skincareData} />
    </>
  );
}
