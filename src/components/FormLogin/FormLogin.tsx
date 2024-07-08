"use client";

import login from '../../actions/Login/login'
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { auth } from '../../../auth';
import { redirect } from 'next/navigation';



const FormLogin = () => {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form action={login}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '24px' }}>
        <TextField
          id="email"
          name='email'
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
            name="password"
            type={showPassword ? "text" : "password"}
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
          type='submit'
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
      </Box>
    </form>
  );
};

export default FormLogin;
