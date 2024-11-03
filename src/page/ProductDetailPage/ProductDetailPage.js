import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart, getCartList } from "../../features/cart/cartSlice";
import { showToastMessage } from "../../features/common/uiSlice";
import AddProductModal from "./component/AddProductModal";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const { cartList } = useSelector((state) => state.cart);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [addButtonText, setAddButtonText] = useState("Add");

  const addItemToCart = async () => {
    //사이즈를 아직 선택안했다면 에러
    if(size ==="") {
      setSizeError(true);
      return;
    }

    // 아직 로그인을 안한유저라면 로그인페이지로
    if(!user) {
      navigate("/login");
      dispatch(showToastMessage({message:"Please log in first", status:"error"}));
      return;
    }
    
    // when a user added same item&size 
    if(!showModal && cartList.find((item)=>item.productId._id === selectedProduct._id && item.productId.size === selectedProduct.size) ){
      setShowModal(true);
      return;
    }

    // 카트에 아이템 추가하기
    await dispatch(addToCart({id,size}));
    setAddButtonText("Thank You!");
    await dispatch(getCartList());
    await new Promise( result => setTimeout(result, 1000) );
    setAddButtonText("Add");
  };

  const selectSize = (value) => {
    // 사이즈 추가하기
    if(sizeError) setSizeError(false);
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  if (loading || !selectedProduct)
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  return (
  <div>
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img src={selectedProduct.image} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">
            $ {currencyFormat(selectedProduct.price)}
          </div>
          <div className="product-info">{selectedProduct.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
              {size === "" ? "Select size" : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).length > 0 &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {item.toUpperCase()}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">
            {sizeError && "Please choose your size."}
          </div>
          <Button variant="dark" className="add-button" disabled={addButtonText==="Thank You!"} onClick={addItemToCart}>
            {addButtonText}
          </Button>
        </Col>
      </Row>
    </Container>
    <AddProductModal
        showModal={showModal}
        setShowModal={setShowModal}
        addItemToCart={addItemToCart}
      />
  </div>

  );
};

export default ProductDetail;
