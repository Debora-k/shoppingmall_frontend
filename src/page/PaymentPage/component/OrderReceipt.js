import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = ({cartList, totalPrice}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">Order</h3>
      <ul className="receipt-list">
        {cartList.length > 0 && cartList.map((item,index)=>(
          <li key={index}>
          <div className="display-flex space-between">
            <div>{item.productId.name}</div>

            <div>$ {item.productId.price*item.qty}</div>
          </div>
        </li>
        ))}
        
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>$ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          Continue to checkout
        </Button>
      )}

      <div>
        Prices and shipping costs are not confirmed until you've reached checkout.
        <div>
          30-day returns. Read more about our return and refund policy.
        </div>
        <div>
          Need help? Please contact Customer Support.
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
