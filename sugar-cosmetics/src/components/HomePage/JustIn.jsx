import { useEffect, useState } from "react";
import FourCardsCarousel from "./FourCardsCarousal";
import TitleForall from "./TitleForall";
import { JustinData } from "./justindata";
import ProductService from "../../app/service/product.service";
import BestsellersCardCarousel from "./BestsellersCardCarousal";

export default function JustIn() {
  const [justInData, setJustInData] = useState([]);
  useEffect(() => {
    ProductService.search({}).then((res) => {
      console.log("res", res);
      setJustInData(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <>
      <TitleForall titlename={"JUST IN"} />
      {/* <FourCardsCarousel BestSellersData={JustinData} /> */}
      <BestsellersCardCarousel BestSellersData={justInData} />
    </>
  );
}
