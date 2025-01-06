import Navbar from "../components/Navbar";
import { Appcontext } from "../context/AppContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ProductNotFound from "../components/Makeup/productNotFound";
import Card2 from "../components/Makeup/Card";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Accordion from "react-bootstrap/Accordion";
import ProductService from "../app/service/product.service";

const sortvalue = ["Price: Low To High", "Price: High To Low"];

const makeupProdType = [
  "Blush",
  "Bronzer",
  "Eyebrow",
  "Eyeliner",
  "Eyeshadow",
  "Foundation",
  "Lip liner",
  "Lipstick",
  "Mascara",
  "Nail polish",
];

const makeupCategory = [
  "Powder",
  "Cream",
  "Pencil",
  "Liquid",
  "Gel",
  "Cream",
  "Palette",
  "Concealer",
  "Contour",
  "Mineral",
  "Highlighter",
  "Lipstick",
  "Lip gloss",
  "Lip stain",
];

const makeupFeature = [
  "Vegan",
  "Canadian",
  "Natural",
  "Gluten free",
  "Non-gmo",
  "Purpicks",
  "Certclean",
  "Ewg verified",
  "Organic",
  "Usda organic",
  "Hypoallergenic",
  "No talc",
  "Ecocert",
];

export default function SearchResultsPage() {
  const [sortV, setSortV] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fParams, filterParamsconst, searchInput, SettingInputEmpty } = useContext(Appcontext);
  const [type, setType] = useState("Blush");
  const [category, setCategory] = useState("");
  const [feature, setFeature] = useState("");
  const [filtereddata, setFiltereddata] = useState([]);
  console.log(type, searchInput);

  useEffect(() => {
    if (sortV == "Price: Low To High") {
      setLoading(true);
      let sorteddata = filtereddata.sort(function (a, b) {
        return (
          Number(b.minPrice) - Number(a.minPrice)
        )
      })

      setFiltereddata(sorteddata);
      setLoading(false);
    }
    if (sortV == "Price: High To Low") {
      setLoading(true);
      let sorteddata = filtereddata.sort(function (a, b) {
        return (
          Number(a.minPrice) - Number(b.minPrice)
        )
      })

      setFiltereddata(sorteddata);
      setLoading(false);
    }
  }, [sortV])

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [searchInput]);


  useEffect(() => {
    getData();
  }, [searchInput])


  const getData = async () => {
    setLoading(true);

    const res = await ProductService.search({
      keyword: searchInput,
    });
    console.log("log", res.data);
    setFiltereddata(res.data);
    setLoading(false);
  }



  // useEffect(() => {
  //   setLoading(true);
  //   const Returnfetchuser = () => {

  //     return fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${type}&product_category=${category}&product_tags=${feature}`).then((res) =>
  //       res.json()
  //     );

  //   };

  //   Returnfetchuser().then((res) => {
  //     setTimeout(() => {
  //       setFiltereddata(res);
  //       setLoading(false);

  //     }, 1000);

  //     //  console.log(filtereddata);

  //   });
  //   // console.log(type,category,feature);

  // }, [type, category, feature])


  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "135px" }}></div>
      <div style={{ width: "100%", height: "19px", marginTop: "10px", marginBottom: "10px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "left" }}>
        <div style={{ width: "20%", height: "19px", color: "#808080" }}>Search Results for {searchInput}</div>
      </div>

      <div style={{ display: "flex", width: "95%", margin: "auto" }}>
        
        <div className="prod_data">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
              return (
                <Card
                  style={{
                    width: "346px",
                    height: "420px",
                    borderRadius: "10px",
                  }}
                >
                  <Card.Img
                    style={{
                      width: "146px",
                      height: "222px",
                      margin: "auto",
                      marginTop: "10px",
                    }}
                    variant="top"
                    src="https://www.macmillandictionary.com/us/external/slideshow/full/Grey_full.png"
                    animation="glow"
                  />
                  <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={10} />
                    </Placeholder>
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder
                        style={{ marginTop: "5px", marginBottom: "5px" }}
                        xs={5}
                      />
                    </Placeholder>
                    <Placeholder as={Card.Title} animation="glow">
                      <Placeholder xs={8} />
                    </Placeholder>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: "30px",
                      }}
                    >
                      <Placeholder.Button
                        variant="dark"
                        style={{
                          width: "42px",
                          height: "42px",
                        }}
                        xs={3}
                      />
                      <Placeholder.Button
                        style={{
                          width: "222px",
                          height: "44px",
                        }}
                        variant="dark"
                      />
                    </div>
                  </Card.Body>
                </Card>
              );
            })
            : filtereddata?.length == undefined || filtereddata?.length == 0 ? <ProductNotFound /> :
              filtereddata.map((el) => {
                return <Card2 carddata={el} id={el.id} />;
              })}
          {/* cards */}
        </div>
      </div>
      <div style={{ color: "lightgray", marginTop: "190px" }}>
        _______________________________________________________________________________________________________________________________________________________________________________
      </div>
      <Footer />


    </>
  )
}