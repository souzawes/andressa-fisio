import React from 'react';
import "../globals.css";

import { AppBar, Box, IconButton, Stack, Toolbar } from "@mui/material";

import Image from 'next/image';
import logoAppBar from "../../../public/logoappbar.svg";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GradientIcon from '@/components/GradientIcon/GradientIcon';

function DashBoard({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      height="100vh"
    >
      <AppBar elevation={0} color="transparent" sx={{ display: 'flex', justifyContent: 'center', height: '10vh' }} >
        {/* <Box style={{ display: "flex", width: "inherit"}}> */}
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
            <Image src={logoAppBar} alt="" width={215} height={70} style={{ marginLeft: '4vw' }} />
            <Stack
              sx={{
                width: "230px",
                height: "35px",
                display: "flex",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-around",
                backgroundColor: "#E8E8E8",
                borderRadius: "20px",
                marginRight: "4vw"
              }}
            >
              <GradientIcon icon={<NotificationsNoneIcon sx={{ color: "#0B3948", fill: "url(#gradientColors)" }} />} />
              <GradientIcon icon={<SettingsOutlinedIcon sx={{ color: "#0B3948", fill: "url(#gradientColors)" }} />} />
              <GradientIcon icon={<LogoutOutlinedIcon sx={{ color: "#0B3948", fill: "url(#gradientColors)" }} />} />
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
          backgroundColor: "#E8E8E8",
          borderRadius: "20px 20px 0px 0px",
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

export default DashBoard;
