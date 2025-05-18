import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { Badge, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../Redux/Customers/Cart/Action";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { cart } = useSelector((store) => store);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading when starting to fetch cart
    setIsLoading(true);
    
    if (jwt) {
      dispatch(getCart(jwt))
        .then(() => {
          // Small delay to ensure images have time to start loading
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [jwt, dispatch]);

  // Preload images when cart data is available
  useEffect(() => {
    if (cart.cartItems && cart.cartItems.length > 0) {
      cart.cartItems.forEach(item => {
        if (item?.product?.imageUrl) {
          const img = new Image();
          img.src = item.product.imageUrl;
        }
      });
    }
  }, [cart.cartItems]);
  
  if (isLoading) {
    return (
      <div className="h-[85vh] flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="">
      {cart.cartItems?.length > 0 ? (
        <div className="lg:grid grid-cols-3 lg:px-16 relative">
          <div className="lg:col-span-2 lg:px-5 bg-white">
            <div className="space-y-3">
              {cart.cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <CartItem item={item} showButton={true} />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
            <div className="border p-5 bg-white shadow-lg rounded-md">
              <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
              <hr />

              <div className="space-y-3 font-semibold">
                <div className="flex justify-between pt-3 text-black">
                  <span>Price ({cart.cart?.totalItem} item)</span>
                  <span>₹{cart.cart?.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-700">-₹{cart.cart?.discounte}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-700">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-700">
                    ₹{cart.cart?.totalDiscountedPrice}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout?step=2")}
                variant="contained"
                type="submit"
                sx={{ padding: ".8rem 2rem", marginTop: "2rem", width: "100%" }}
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[85vh] flex justify-center items-center flex-col">
          <div className="text-center py-5">
            <h1 className="text-lg font-medium">Hey, it feels so light!</h1>
            <p className="text-gray-500 text-sm">
              There is nothing in your bag, let's add some items
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outlined" sx={{ py: "11px" }}>
            Add Items From Store
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
