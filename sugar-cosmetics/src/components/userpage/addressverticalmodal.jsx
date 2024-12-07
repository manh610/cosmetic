import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import swal from "sweetalert";
import { useContext, useState, useEffect } from "react";
import "../../styles/Home.css";
import { Appcontext } from "../../context/AppContext";
import AddressService from "../../app/service/address.service";

export default function MyVerticallyCenteredModal(props) {
  const { onHide } = props;
  const { Loginstate, LogoutUser } = useContext(Appcontext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [mnumber, setMnumber] = useState("");
  const [pincode, setPin] = useState("");
  const [area, setArea] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [flat, setflat] = useState("");
  const { address, AddAddress } = useContext(Appcontext);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [selectedWard, setSelectedWard] = useState();

  useEffect(() => {
    console.log(address);
  }, [address]);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const res = await AddressService.getProvinces();
      console.log(res);
      setProvinces(res.data);
    } catch (error) {
      console.error("Error loading provinces:", error);
    }
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setState(e.target.options[e.target.selectedIndex].text);
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]);

    try {
      const res = await AddressService.getDistricts(provinceId);
      setDistricts(res.data);
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setCity(e.target.options[e.target.selectedIndex].text);
    setSelectedWard("");

    try {
      const res = await AddressService.getWards(districtId);
      setWards(res.data);
    } catch (error) {
      console.error("Error loading wards:", error);
    }
  };

  const addressSaving = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        wardId: selectedWard,
        userId: Loginstate.userdata.id, // This should probably come from user context/props
        detail: flat,
        isDefault: false,
        fullName: `${firstName} ${lastName}`.trim(),
        phone: mnumber,
        addressType: "HOME"
      };
      console.log(payload);
      const res = await AddressService.addAddressUser(payload);
      console.log(res);
      swal({
        icon: "success",
        text: "Address saved successfully",
        buttons: false,
      });

      //reset form
      setFirstName("");
      setLastname("");
      setMnumber("");
      setflat("");
      onHide();
    } catch (error) {
      console.error("Error saving address:", error);
      swal({
        icon: "error",
        text: "Something went wrong",
        buttons: false,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add New Address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Control
                type="number"
                placeholder="Enter 10 digit Phone Number to save and continue"
                value={mnumber}
                className="inputnumber_otp"
                onChange={(e) => setMnumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Control
                type="text"
                placeholder="Flat/House No."
                value={flat}
                onChange={(e) => setflat(e.target.value)}
              />
            </Form.Group>
          </Row>

          {/* <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Control
              placeholder="Apartment,Area,Locality,Road..."
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Form.Group> */}

          {/* <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Control
                placeholder="Pincode"
                type="number"
                className="inputnumber_otp"
                value={pincode}
                onChange={(e) => setPin(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridCity">
              {pincode.length == 6 ? (
                <Button
                  style={{ backgroundColor: "#000", color: "#fff" }}
                  onClick={() => {
                    swal({
                      icon: "success",
                      text: "estimated delivery in between 2 to 10 days",
                      buttons: false,
                    });
                  }}
                >
                  CHECK
                </Button>
              ) : (
                <Button
                  style={{ backgroundColor: "#000", color: "#fff" }}
                  disabled
                >
                  {" "}
                  CHECK
                </Button>
              )}
            </Form.Group>
          </Row> */}

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Select
                value={selectedProvince}
                onChange={handleProvinceChange}
              >
                <option value="">Select Province</option>
                {provinces.length > 0 && provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
              >
                <option value="">Select District</option>
                {districts.length > 0 && districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridWard">
              <Form.Select
                value={selectedWard}
                onChange={(e) => {
                  setSelectedWard(e.target.value);
                  setArea(e.target.options[e.target.selectedIndex].text);
                }}
                disabled={!selectedDistrict}
              >
                <option value="">Select Ward</option>
                {wards.length > 0 && wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>


          {firstName == "" ||
            lastName == "" ||
            mnumber == "" ||
            mnumber.length != 10 ||
            selectedWard == "" ||
            flat == "" ? (
            <Button
              variant="primary"
              type="submit"
              style={{
                marginLeft: "270px",
                backgroundColor: "#000",
                color: "#fff",
              }}
              disabled
            >
              SAVE AND CONTINUE
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              style={{
                marginLeft: "270px",
                backgroundColor: "#000",
                color: "#fff",
              }}
              onClick={addressSaving}
            >
              SAVE AND CONTINUE
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
