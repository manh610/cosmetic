import { useEffect, useState } from "react";
import FourCardsCarousel from "./FourCardsCarousal";
import TitleForall from "./TitleForall";
import { JustinData } from "./justindata";
import ProductService from "../../app/service/product.service";
import BestsellersCardCarousel from "./BestsellersCardCarousal";

export default function JustIn() {
  const [justInData, setJustInData] = useState([]);
  useEffect(() => {
    ProductService.search({
      pageIndex: 1,
      pageSize: 4
    }).then((res) => {
      console.log("res", res);
      setJustInData([...res.data].sort(() => Math.random() - 0.5));
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
