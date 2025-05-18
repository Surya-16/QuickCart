import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeCartItem, updateCartItem } from "../../../Redux/Customers/Cart/Action";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const CartItem = ({ item, showButton }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  
  // Set image source when item changes
  useEffect(() => {
    if (item?.product?.imageUrl) {
      setImgSrc(item.product.imageUrl);
    }
  }, [item]);

  const handleRemoveItemFromCart = () => {
    const data = { cartItemId: item?.id, jwt };
    dispatch(removeCartItem(data));
  };
  
  const handleUpdateCartItem = (num) => {
    const data = { data: { quantity: item.quantity + num }, cartItemId: item?.id, jwt };
    dispatch(updateCartItem(data));
  };
  
  const handleImageError = () => {
    // If image fails to load, retry with a timestamp to prevent caching
    setImgSrc(`${item?.product?.imageUrl}?${new Date().getTime()}`);
  };
  
  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] relative">
          {!imgLoaded && (
            <div className="w-full h-full bg-gray-200 animate-pulse absolute top-0 left-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Loading...</span>
            </div>
          )}
          <img
            className={`w-full h-full object-cover object-top ${imgLoaded ? '' : 'opacity-0'}`}
            src={imgSrc}
            alt={item?.product?.title || "Product"}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="eager"
          />
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">{item?.product?.title}</p>
          <p className="opacity-70">Size: {item?.size},White</p>
          <p className="opacity-70 mt-2">Seller: {item?.product?.brand}</p>
          <div className="flex space-x-2 items-center pt-3">
            <p className="opacity-50 line-through">₹{item?.product?.price}</p>
            <p className="font-semibold text-lg">
              ₹{item?.product?.discountedPrice}
            </p>
            <p className="text-green-600 font-semibold">
              {item?.product?.discountPersent}% off
            </p>
          </div>
        </div>
      </div>
      {showButton && <div className="lg:flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2 ">
          <IconButton onClick={() => handleUpdateCartItem(-1)} disabled={item?.quantity <= 1} color="primary" aria-label="decrease quantity">
            <RemoveCircleOutlineIcon />
          </IconButton>

          <span className="py-1 px-7 border rounded-sm">{item?.quantity}</span>
          <IconButton onClick={() => handleUpdateCartItem(1)} color="primary" aria-label="increase quantity">
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
        <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
          <Button onClick={handleRemoveItemFromCart} variant="text">
            Remove{" "}
          </Button>
        </div>
      </div>}
    </div>
  );
};

export default CartItem;
