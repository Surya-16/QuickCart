import { Grid, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, register } from "../../../Redux/Auth/Action";
import { Fragment, useEffect, useState } from "react";


export default function RegisterUserForm({ handleNext }) {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [openSnackBar,setOpenSnackBar]=useState(false);
  const { auth } = useSelector((store) => store);
  const handleClose=()=>setOpenSnackBar(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const jwt=localStorage.getItem("jwt");

useEffect(()=>{
  if(jwt){
    dispatch(getUser(jwt))
  }

},[jwt])


  useEffect(() => {
    if (auth.user || auth.error) {
      setOpenSnackBar(true);
      
      // Auto-redirect to home page after successful registration
      if (auth.user && !auth.error) {
        setTimeout(() => {
          navigate("/");
        }, 3000); // Redirect after 3 seconds to show success message
      }
    }
  }, [auth.user, auth.error, navigate]);
  
  const validate = (userData) => {
    const errors = {};
    
    // First name validation
    if (!userData.firstName) {
      errors.firstName = 'First name is required';
    } else if (userData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters long';
    } else if (userData.firstName.length > 50) {
      errors.firstName = 'First name is too long (maximum 50 characters)';
    } else if (!/^[a-zA-Z\s'-]+$/.test(userData.firstName)) {
      errors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    // Last name validation
    if (!userData.lastName) {
      errors.lastName = 'Last name is required';
    } else if (userData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long';
    } else if (userData.lastName.length > 50) {
      errors.lastName = 'Last name is too long (maximum 50 characters)';
    } else if (!/^[a-zA-Z\s'-]+$/.test(userData.lastName)) {
      errors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
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
    } else if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (userData.password.length > 128) {
      errors.password = 'Password is too long (maximum 128 characters)';
    } else if (!/(?=.*[a-z])/.test(userData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(userData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(userData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(userData.password)) {
      errors.password = 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
    } else if (/^\s+|\s+$/.test(userData.password)) {
      errors.password = 'Password cannot start or end with spaces';
    }
    
    // Confirm password validation
    if (!userData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      firstName: data.get("firstName")?.trim(),
      lastName: data.get("lastName")?.trim(),
      email: data.get("email")?.trim(),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      role: "ROLE_CUSTOMER" // Default role is now ROLE_CUSTOMER
    }
    
    // Mark all fields as touched
    setTouched({ 
      firstName: true, 
      lastName: true, 
      email: true, 
      password: true, 
      confirmPassword: true 
    });
    
    const validationErrors = validate(userData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = userData;
    dispatch(register(registrationData));
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
    <div className="">
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
              onBlur={() => handleBlur('firstName')}
              error={!!(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              placeholder="Enter your first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="family-name"
              onBlur={() => handleBlur('lastName')}
              error={!!(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              placeholder="Enter your last name"
            />
          </Grid>
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
              autoComplete="new-password"
              type="password"
              onBlur={() => handleBlur('password')}
              error={!!(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              placeholder="Create a strong password"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              fullWidth
              autoComplete="new-password"
              type="password"
              onBlur={() => handleBlur('confirmPassword')}
              error={!!(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              placeholder="Confirm your password"
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
              {auth.loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Grid>
        </Grid>
      </form>

<div className="flex justify-center flex-col items-center">
     <div className="py-3 flex items-center ">
        <p className="m-0 p-0">if you have already account ?</p>
        <Button onClick={()=> navigate("/login")} className="ml-5" size="small">
          Login
        </Button>
      </div>
</div>

<Snackbar 
  open={openSnackBar} 
  autoHideDuration={auth.user && !auth.error ? 4000 : 6000} 
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
        <Alert 
          onClose={handleClose} 
          severity={auth.error ? "error" : "success"} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {auth.error
            ? getErrorMessage(auth.error)
            : auth.user
              ? `Welcome ${auth.user.firstName || 'User'}! Your account has been created successfully. Redirecting to home...`
              : ""}
        </Alert>
      </Snackbar>
     
    </div>
  );
}
