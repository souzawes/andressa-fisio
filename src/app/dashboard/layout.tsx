import React from 'react';
import "../globals.css";

import { auth } from '../../../auth';
import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material";
import logout from '../../actions/Logout/logout';


import Image from 'next/image';
import logoAppBar from "../../../public/logoappbar.svg";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GradientIcon from '@/components/GradientIcon/GradientIcon';

import { redirect } from 'next/navigation';

async function DashBoard({
  children
}: {
  children: React.ReactNode;
}) {

  const margin = '2vw'

  let user = undefined

  const session = await auth()

  if (session) {
    user = session.user
  } else {
    return redirect("/")
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      height="100vh"
    >

      <AppBar
        elevation={0}
        color="transparent"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '12vh'
        }}
      >
        <Box sx={{ display: 'flex', width: 'inherit' }}>
          <Toolbar
            disableGutters
            sx={{
              width: "inherit",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image src={logoAppBar} alt="" width={215} height={70} style={{ marginLeft: margin }} />

            <Stack
              sx={{
                width: "auto",
                height: "7vh",
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-around",
                backgroundColor: "rgb(241, 241, 241, 0.75)",
                borderRadius: "5px",
                paddingLeft: "16px",
                marginRight: margin
              }}
            >
              <p style={{ color: '#0095A1', marginRight: '16px' }} >Olá, {user?.name ?? ''}! </p>

              <form className='logout' action={logout}>
                <Button
                  type='submit'
                  sx={{
                    width: 'inherit',
                    marginRight: '10px',
                    backgroundColor: 'rgb(241, 241, 241, 0.5)'
                  }}
                >
                  <GradientIcon icon={<LogoutOutlinedIcon sx={{ color: "#0B3948", fill: "url(#gradientColors)" }} />} />
                </Button>
              </form>

            </Stack>
          </Toolbar>
        </Box>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "96vw",
          height: "88vh",
          backgroundColor: "rgb(241, 241, 241, 0.9)",
          borderRadius: "5px 5px 0px 0px",
          zIndex: 1,
        }}
      >
        {children}
      </Box>

    </Stack>
  );
}

export default DashBoard;
