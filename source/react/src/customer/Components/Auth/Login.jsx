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
  const [touched, setTouched] = useState({});
  
  useEffect(()=>{
    if(jwt){
      dispatch(getUser(jwt))
    }
  
  },[jwt])
  
  
  useEffect(() => {
    if (auth.user || auth.error) {
      setOpenSnackBar(true);
      
      // Auto-redirect to home page after successful login
      if (auth.user && !auth.error) {
        setTimeout(() => {
          navigate("/");
        }, 2000); // Redirect after 2 seconds to show success message
      }
    }
  }, [auth.user, auth.error, navigate]);
    
  const validate = (userData) => {
    const errors = {};
    
    // Email validation
    if (!userData.email) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (userData.email.length > 254) {
      errors.email = 'Email address is too long';
    }
    
    // Password validation
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 4) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (userData.password.length > 128) {
      errors.password = 'Password is too long (maximum 128 characters)';
    } else if (/^\s+|\s+$/.test(userData.password)) {
      errors.password = 'Password cannot start or end with spaces';
    }
    
    return errors;
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData={
      email: data.get("email")?.trim(),
      password: data.get("password"),
    }
    
    // Mark all fields as touched
    setTouched({ email: true, password: true });
    
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
              autoComplete="email"
              type="email"
              onBlur={() => handleBlur('email')}
              error={!!(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              placeholder="Enter your email address"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              autoComplete="current-password"
              type="password"
              onBlur={() => handleBlur('password')}
              error={!!(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              placeholder="Enter your password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              className="bg-[#9155FD] w-full"
              type="submit"
              variant="contained"
              size="large"
              sx={{padding:".8rem 0"}}
              disabled={auth.loading}
            >
              {auth.loading ? 'Logging in...' : 'Login'}
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
        autoHideDuration={auth.user && !auth.error ? 3000 : 6000}
        onClose={handleCloseSnakbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnakbar}
          severity={auth.error ? "error" : "success"}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {auth.error
            ? getErrorMessage(auth.error)
            : auth.user
              ? `Welcome back, ${auth.user.firstName || 'User'}! Login successful. Redirecting...`
              : ""}
        </Alert>
      </Snackbar>
    </div>
  );
}
