import { useEffect, useState } from "react";
import ProductService from "../../app/service/product.service";
import { BestSellersData } from "../HomePage/bestsellerdata";
import FourCardsCarousel from "../HomePage/FourCardsCarousal";
import { JustinData } from "../HomePage/justindata";
import TitleForall from "../HomePage/TitleForall";


export default function ShopFromRecentlyViewed( {categoryId} ) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await ProductService.search({
      categoryId: categoryId
    });
    setData(res.data);      
  }
  return (
    <>
      <TitleForall titlename={"SHOP FROM RECENTLY VIEWED"} />
      <FourCardsCarousel BestSellersData={data} />
    </>
  );
}
