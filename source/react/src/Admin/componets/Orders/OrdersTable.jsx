import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Grid, Select } from "@mui/material";
import { dressPage1 } from "../../../Data/dress/page1";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
} from "../../../Redux/Admin/Orders/Action";
import { configure } from "@testing-library/react";

const OrdersTable = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const [orderStatus, setOrderStatus] = useState("");
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { adminsOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = useState([]);

  // Debug logging to understand data structure
  console.log("adminsOrder state:", adminsOrder);
  console.log("adminsOrder.orders:", adminsOrder.orders);
  console.log("Is orders an array?", Array.isArray(adminsOrder.orders));

  useEffect(() => {
    dispatch(getOrders({ jwt }));
  }, [jwt,adminsOrder.delivered, adminsOrder.shipped, adminsOrder.confirmed]);

  // Get orders array - handle different possible data structures
  const getOrdersArray = () => {
    if (!adminsOrder.orders) return [];
    
    // If orders is already an array, return it
    if (Array.isArray(adminsOrder.orders)) {
      return adminsOrder.orders;
    }
    
    // If orders is an object with a content property (common pagination structure)
    if (adminsOrder.orders.content && Array.isArray(adminsOrder.orders.content)) {
      return adminsOrder.orders.content;
    }
    
    // If orders is an object with a data property
    if (adminsOrder.orders.data && Array.isArray(adminsOrder.orders.data)) {
      return adminsOrder.orders.data;
    }
    
    // If orders is an object with an orders property
    if (adminsOrder.orders.orders && Array.isArray(adminsOrder.orders.orders)) {
      return adminsOrder.orders.orders;
    }
    
    console.warn("Orders data structure not recognized:", adminsOrder.orders);
    return [];
  };

  const ordersArray = getOrdersArray();

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({ ...formData, [name]: value });
  };
  function handlePaginationChange(event, value) {
    console.log("Current page:", value);
  }

  const handleConfirmedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(confirmOrder(orderId));
    setOrderStatus("CONFIRMED")
  };

  const handleShippedOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(shipOrder(orderId))
    setOrderStatus("ShIPPED")
  };

  const handleDeliveredOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deliveredOrder(orderId))
    setOrderStatus("DELIVERED")
  };

  const handleDeleteOrder = (orderId) => {
    handleUpdateStatusMenuClose();
    dispatch(deleteOrder(orderId));
  };

  //   useEffect(()=>{
  // setUpdateOrderStatus(item.orderStatus==="PENDING"?"PENDING": item.orderStatus==="PLACED"?"CONFIRMED":item.orderStatus==="CONFIRMED"?"SHIPPED":"DELEVERED")
  //   },[adminsOrder.orders])

  return (
    <Box>
      {/* Loading state */}
      {adminsOrder.loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Loading orders...</Typography>
        </Box>
      )}

      {/* Error state */}
      {adminsOrder.error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography color="error">Error loading orders: {adminsOrder.error}</Typography>
        </Box>
      )}

      {/* Empty state */}
      {!adminsOrder.loading && !adminsOrder.error && ordersArray.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>No orders found</Typography>
        </Box>
      )}

      {/* Orders table - only show when we have data */}
      {!adminsOrder.loading && !adminsOrder.error && ordersArray.length > 0 && (
        <>
          {/* <Card className="p-3">
            <CardHeader
              title="Sort"
              sx={{
                pt: 0,
                alignItems: "center",
                "& .MuiCardHeader-action": { mt: 0.6 },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value={"PLACED"}>PLACED</MenuItem>
                    <MenuItem value={"CONFIRMED"}>CONFIRMED</MenuItem>
                    <MenuItem value={"DELIVERED"}>DELIVERED</MenuItem>
                    <MenuItem value={"CANCELD"}>CANCLED</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formData.sort}
                    label="Sort By"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Newest"}>Newest</MenuItem>
                    <MenuItem value={"Older"}>Older</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card> */}
          <Card className="mt-2">
            <CardHeader
              title="All Orders"
              sx={{
                pt: 2,
                alignItems: "center",
                "& .MuiCardHeader-action": { mt: 0.6 },
              }}
            />
            <TableContainer>
              <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Id</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersArray?.map((item, index) => (
                    <TableRow
                      hover
                      key={item.id || index}
                      sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                    >
                      <TableCell sx={{}}>
                        <AvatarGroup max={4} sx={{justifyContent: 'start'}}>
                          {item.orderItems?.map((orderItem, idx) => (
                            <Avatar key={idx} alt={item.title} src={orderItem.product?.imageUrl} />
                          ))}
                        </AvatarGroup>
                      </TableCell>

                      <TableCell
                        sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.875rem !important",
                            }}
                          >
                            {item?.orderItems?.map((order, idx) => (
                              <span key={idx} className=""> {order.product?.title},</span>
                            ))}
                          </Typography>
                          <Typography variant="caption">
                            {item?.orderItems?.map((order, idx) => (
                              <span key={idx} className="opacity-60">
                                {" "}
                                {order.product?.brand},
                              </span>
                            ))}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>{item.totalPrice}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="text-white">
                        <Chip
                          sx={{
                            color: "white !important",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                          label={item.orderStatus}
                          size="small"
                          color={
                            item.orderStatus === "PENDING" ? "info" :item.orderStatus==="DELIVERED"? "success":"secondary"
                          }
                          className="text-white"
                        />
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center" }}
                        className="text-white"
                      >
                        <div>
                          <Button
                            id={`basic-button-${item.id}`}
                            aria-controls={`basic-menu-${item.id}`}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorElArray[index])}
                            onClick={(event) =>
                              handleUpdateStatusMenuClick(event, index)
                            }
                          >
                            Status
                          </Button>
                          <Menu
                            id={`basic-menu-${item.id}`}
                            anchorEl={anchorElArray[index]}
                            open={Boolean(anchorElArray[index])}
                            onClose={() => handleUpdateStatusMenuClose(index)}
                            MenuListProps={{
                              "aria-labelledby": `basic-button-${item.id}`,
                            }}
                          >
                            <MenuItem
                              onClick={() => handleConfirmedOrder(item.id, index)}
                              disabled={item.orderStatus==="DELEVERED" || item.orderStatus==="SHIPPED" || item.orderStatus==="CONFIRMED"}
                            >
                              CONFIRMED ORDER
                            </MenuItem>
                            <MenuItem
                              disabled={item.orderStatus==="DELIVERED" || item.orderStatus==="SHIPPED"}
                              onClick={() => handleShippedOrder(item.id, index)}
                            >
                              SHIPPED ORDER
                            </MenuItem>
                            <MenuItem onClick={() => handleDeliveredOrder(item.id, index)}>
                              DELIVERED ORDER
                            </MenuItem>
                          </Menu>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center" }}
                        className="text-white"
                      >
                        <Button
                          onClick={() => handleDeleteOrder(item.id)}
                          variant="text"
                        >
                          delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Box>
  );
};

export default OrdersTable;
