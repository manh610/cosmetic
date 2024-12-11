import ProductService from "../../app/service/product.service";
import FourCardsCarousel from "../HomePage/FourCardsCarousal";
import { JustinData } from "../HomePage/justindata";
import TitleForall from "../HomePage/TitleForall";
import { useEffect, useState } from "react";


export default function Recommended({ categoryId }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    console.log(categoryId);
    const res = await ProductService.search({
      categoryId: categoryId
    });
    console.log(res);
    setData(res.data);
    // const res = await ProductService.getByCategoryId(categoryId);
    // setData(res.data);
  }
  return (
    <>
      <TitleForall titlename={"RECOMMENDED PRODUCTS"} />
      <FourCardsCarousel BestSellersData={data} />
    </>
  );
}
