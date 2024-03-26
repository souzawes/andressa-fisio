"use client";

import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";

import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAppDispatch } from "../../hooks/redux-hooks";
// import { login } from "../../slices/authSlice";
// import {
//   showNotification,
//   NotificationType,
// } from "../../slices/notificationSlice";

const FormLogin = () => {
  // const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const redirectToDashboard = () => {
    // return <Link to={"/dashboard"}></Link>;
  };

  return (
    <>
      <TextField
        id="email"
        label="usuário"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ width: "400px", borderRadius: "20px" }}
        InputProps={{
          style: {
            borderRadius: "20px",
          },
        }}
      />
      <FormControl
        sx={{ m: 1, width: "400px", margin: "dense", borderRadius: "20px" }}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">senha</InputLabel>
        <OutlinedInput
          sx={{ borderRadius: "20px" }}
          id="password"
          type={showPassword ? "text" : "password"}
          //   startAdornment={
          //     <InputAdornment position="start">
          //       <Icon>
          //         <Lock />
          //       </Icon>
          //     </InputAdornment>
          //   }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>

      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{
          backgroundColor: "#0B3948",
          width: "170px",
          height: "50px",
          borderRadius: "20px",
          textTransform: "capitalize",
        }}
      >
        Entrar
      </Button>
    </>
  );
};

export default FormLogin;
