import { Grid, TextField, Button, Box, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
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

  const jwt=localStorage.getItem("jwt");

useEffect(()=>{
  if(jwt){
    dispatch(getUser(jwt))
  }

},[jwt])


  useEffect(() => {
    if (auth.user || auth.error) setOpenSnackBar(true)
  }, [auth.user]);
  
  const validate = (userData) => {
    const errors = {};
    if (!userData.firstName) {
      errors.firstName = 'First name is required';
    }
    if (!userData.lastName) {
      errors.lastName = 'Last name is required';
    }
    if (!userData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userData.password)) {
      errors.password = 'Password must contain a special character';
    }
    if (!userData.role) {
      errors.role = 'Role is required';
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData={
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      role: data.get("role")
    }
    const validationErrors = validate(userData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    dispatch(register(userData))
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
        <FormControl fullWidth error={!!errors.role}>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Role"
          name="role"
        >
          <MenuItem value={"ROLE_ADMIN"}>Admin</MenuItem>
          <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
        </Select>
        {errors.role && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.role}</span>}
      </FormControl>
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
              Register
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

<Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {auth.error?auth.error:auth.user?"Register Success":""}
        </Alert>
      </Snackbar>
     
    </div>
  );
}
