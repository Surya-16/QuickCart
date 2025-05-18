import * as React from "react";
import { Grid, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../../Redux/Auth/Action";
import { useEffect } from "react";
import { useState } from "react";

export default function LoginUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const jwt=localStorage.getItem("jwt");
  const [openSnackBar,setOpenSnackBar]=useState(false);
  const { auth } = useSelector((store) => store);
  const handleCloseSnakbar=()=>setOpenSnackBar(false);
  const [errors, setErrors] = useState({});
  useEffect(()=>{
    if(jwt){
      dispatch(getUser(jwt))
    }
  
  },[jwt])
  
  
    useEffect(() => {
      if (auth.user || auth.error) setOpenSnackBar(true);
    }, [auth.user, auth.error]);
  const validate = (userData) => {
    const errors = {};
    if (!userData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData={
      email: data.get("email"),
      password: data.get("password"),
    }
    const validationErrors = validate(userData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    dispatch(login(userData));
  };

  // Helper to get a string error message from any error type
  const getErrorMessage = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
      return error.error || error.message || JSON.stringify(error);
    }
    return String(error);
  };

  return (
    <div className="shadow-lg">
      <form className="w-full" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="given-name"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="given-name"
              type="password"
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className="bg-[#9155FD] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{padding:".8rem 0"}}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
      {auth.error && (
        <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>
          {getErrorMessage(auth.error)}
        </div>
      )}
      <div className="flex justify-center flex-col items-center">
         <div className="py-3 flex items-center">
        <p className="m-0 p-0">don't have account ?</p>
        <Button onClick={()=> navigate("/register")} className="ml-5" size="small">
          Register
        </Button>
        </div>
      </div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnakbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnakbar}
          severity={auth.error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {auth.error
            ? getErrorMessage(auth.error)
            : auth.user
              ? "Login Success"
              : ""}
        </Alert>
      </Snackbar>
    </div>
  );
}
