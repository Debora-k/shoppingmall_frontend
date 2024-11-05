import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  if (orderNum === "")
    return (
      <Container className="confirmation-page">
        <h1>Failed to order</h1>
        <div>
          Go back to main page
          <Link to={"/"}>Main page</Link>
        </div>
      </Container>
    );
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>Complete your order!</h2>
      <div>Order #:{orderNum}</div>
      <div>
        Check your order on your order history
        <div className="text-align-center">
          <Link to={"/account/purchase"}>My Order</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
