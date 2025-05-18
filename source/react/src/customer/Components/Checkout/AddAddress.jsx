import * as React from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../Redux/Customers/Order/Action";
import userEvent from "@testing-library/user-event";
import AddressCard from "../adreess/AdreessCard";
import { useState } from "react";

export default function AddDeliveryAddressForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);
  const [selectedAddress, setSelectedAdress] = useState(null);
  const [errors, setErrors] = useState({});

  // console.log("auth", auth);

  const validate = (address) => {
    const errors = {};
    if (!address.firstName) errors.firstName = 'First name is required';
    if (!address.lastName) errors.lastName = 'Last name is required';
    if (!address.streetAddress) errors.address = 'Address is required';
    if (!address.city) errors.city = 'City is required';
    if (!address.state) errors.state = 'State is required';
    if (!address.zipCode) {
      errors.zip = 'Zip code is required';
    } else if (!/^\d{5,6}$/.test(address.zipCode)) {
      errors.zip = 'Zip code must be 5 or 6 digits';
    }
    if (!address.mobile) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(address.mobile)) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      streetAddress: data.get("address"),
      city: data.get("city"),
      state: data.get("state"),
      zipCode: data.get("zip"),
      mobile: data.get("phoneNumber"),
    };
    const validationErrors = validate(address);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    dispatch(createOrder({ address, jwt, navigate }));
    handleNext();
  };

  const handleCreateOrder = (item) => {
    dispatch(createOrder({ address:item, jwt, navigate }));
    handleNext();
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={5}>
        <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-scroll ">
          {auth.user?.addresses.map((item) => (
            <div
              onClick={() => setSelectedAdress(item)}
              className="p-5 py-7 border-b cursor-pointer"
            >
              {" "}
              <AddressCard address={item} />
              {selectedAddress?.id === item.id && (
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={()=>handleCreateOrder(item)}
                >
                  Deliverd Here
                </Button>
              )}
            </div>
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Box className="border rounded-md shadow-md p-5">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  autoComplete="given-name"
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  autoComplete="given-name"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  autoComplete="shipping address"
                  multiline
                  rows={4}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="shipping address-level2"
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="State/Province/Region"
                  fullWidth
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zip"
                  name="zip"
                  label="Zip / Postal code"
                  fullWidth
                  autoComplete="shipping postal-code"
                  error={!!errors.zip}
                  helperText={errors.zip}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  autoComplete="tel"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ padding: ".9rem 1.5rem" }}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Deliverd Here
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
