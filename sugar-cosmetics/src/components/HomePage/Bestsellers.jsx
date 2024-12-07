import { useEffect, useState } from "react";
import BestsellersCardCarousel from "./BestsellersCardCarousal";
import ProductService from "../../app/service/product.service";
// import { BestSellersData } from "./bestsellerdata";

export default function BestSellers() {
  const [bestSellersData, setBestSellersData] = useState([]);
  useEffect(() => {
    ProductService.search({}).then((res) => {
      console.log("res", res);
      setBestSellersData(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="BestSellers">
      <div className="titleBS">
        <div className="hr_tag">
          <h4 style={{ color: "#FC2779" }}>───</h4>
        </div>
        <div>
          <h5 style={{ color: "#ffffff", fontWeight: "bold" }}>BESTSELLERS</h5>
        </div>
        <div className="hr_tag">
          <h4 style={{ color: "#FC2779" }}>───</h4>
        </div>
      </div>

      <div className="main_bestsellers">
        <BestsellersCardCarousel BestSellersData={bestSellersData} />
      </div>
    </div>
  );
}
