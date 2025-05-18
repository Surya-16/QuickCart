import { Box, Grid, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import OrderCard from "./OrderCard";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const orderStatus = [
  { label: "On The Way", value: "onTheWay" },
  { label: "Delivered", value: "delevered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const Order = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { order } = useSelector(store => store);

  useEffect(() => {
    console.log("Order component mounted, JWT:", jwt ? "Present" : "Missing");
    if (jwt) {
      dispatch(getOrderHistory({ jwt }));
    }
  }, [jwt, dispatch]);

  console.log("Current order state:", order);
  console.log("Orders array:", order.orders);

  if (!jwt) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-500">Please login to view your orders</p>
      </div>
    );
  }

  if (order.loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (order.error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Error loading orders: {order.error}</p>
      </div>
    );
  }

  return (
    <Box>
      <Grid container spacing={0} sx={{ justifyContent: "space-between" }}>
        <Grid item xs={2.5} className="">
          <div className="h-auto shadow-lg bg-white border p-5 sticky top-5">
            <h1 className="font-bold text-lg">Filters</h1>
            <div className="space-y-4 mt-10">
              <h1 className="font-semibold">ORDER STATUS</h1>
              {orderStatus.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    defaultValue={option.value}
                    type="checkbox"
                    defaultChecked={option.checked}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-3 text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs={9}>
          <Box className="space-y-5">
            {order.orders?.length > 0 ? (
              order.orders.map((order) => {
                console.log("Rendering order:", order);
                return order?.orderItems?.map((item, index) => (
                  <OrderCard key={`${order.id}-${index}`} item={item} order={order} />
                ));
              })
            ) : (
              <div className="flex justify-center items-center h-[50vh]">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Order;
