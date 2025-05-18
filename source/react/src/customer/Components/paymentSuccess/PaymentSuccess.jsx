import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePayment } from "../../../Redux/Customers/Payment/Action";
import { Alert, AlertTitle, Box, Grid } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarIcon from "@mui/icons-material/Star";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import OrderTraker from "../orders/OrderTraker";
import AddressCard from "../adreess/AdreessCard";
import { useLocation } from "react-router-dom";
import { clearCart } from "../../../Redux/Customers/Cart/Action";

const PaymentSuccess = () => {
  const [paymentId, setPaymentId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [cartCleared, setCartCleared] = useState(false);
  const location = useLocation();

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get("order_id");
    
    console.log("Extracted order_id from URL:", orderIdParam);
    
    setOrderId(orderIdParam);
    setPaymentId(urlParams.get("razorpay_payment_id"));
    setReferenceId(urlParams.get("razorpay_payment_link_reference_id"));
    setPaymentStatus(urlParams.get("razorpay_payment_link_status"));
  }, [location.search]);

  useEffect(() => {
    if (paymentId && orderId) {
      // Always process payment if we have paymentId and orderId
      console.log("Processing payment for order:", orderId);
      
      const data = { orderId, paymentId, jwt };
      dispatch(updatePayment(data));
      dispatch(getOrderById(orderId));
      
      // Ensure cart clearing happens only once
      if (!cartCleared) {
        console.log("Clearing cart...");
        dispatch(clearCart(jwt));
        setCartCleared(true);
      }
    }
  }, [orderId, paymentId, dispatch, jwt, cartCleared]);

  // Add a separate effect to handle direct page loads or refreshes
  useEffect(() => {
    // If page is loaded directly with order information, ensure cart is cleared
    if (order.order && !cartCleared) {
      console.log("Order loaded, clearing cart");
      dispatch(clearCart(jwt));
      setCartCleared(true);
    }
  }, [order.order, dispatch, jwt, cartCleared]);

  return (
    <div className="px-2 lg:px-36">
      <div className="flex flex-col justify-center items-center">
        <Alert
          variant="filled"
          severity="success"
          sx={{ mb: 6, width: "fit-content" }}
        >
          <AlertTitle>Payment Success</AlertTitle>
          Congratulation Your Order Get Placed
        </Alert>
      </div>

      <OrderTraker activeStep={1}/>

      <Grid container className="space-y-5 py-5 pt-20">
        {order.order?.orderItems && order.order.orderItems.map((item) => (
          <Grid
            container
            item
            className="shadow-xl rounded-md p-5 border"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
            key={item.id || `${item.product?._id}-${item.size}`}
          >
            <Grid item xs={6}>
              {" "}
              <div className="flex  items-center ">
                <img
                  className="w-[5rem] h-[5rem] object-cover object-top"
                  src={item?.product.imageUrl}
                  alt=""
                />
                <div className="ml-5 space-y-2">
                  <p className="">{item.product.title}</p>
                  <p className="opacity-50 text-xs font-semibold space-x-5">
                    <span>Color: pink</span> <span>Size: {item.size}</span>
                  </p>
                  <p>Seller: {item.product.brand}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            </Grid>
            <Grid item>
              <AddressCard address={order.order?.shippingAddress} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PaymentSuccess;
