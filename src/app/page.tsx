import { Box, Stack } from "@mui/material";

import Image from 'next/image';
import FormLogin from "../components/FormLogin/FormLogin";
import logo from "../../public/logo.svg"
import { auth } from "../../auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await auth()

  if (session) {
    return redirect('/dashboard')
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Image src={logo} alt="" width={460} height={170} style={{ marginLeft: "auto", marginRight: "auto" }} />
      <Box
        sx={{
          width: "50vw",
          height: "100vh",
          borderRadius: "10px 0px 0px 10px",
          backgroundColor: "#E8E8E8",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          rowGap: "24px",
        }}
      >
        <FormLogin />
      </Box>
    </Stack>
  );
};

export default Login;