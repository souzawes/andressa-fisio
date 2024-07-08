'use client';

import { Box, Stack } from '@mui/material';
import ErrorCard from '../components/ErrorCard/ErrorCard';
import logo from "../../public/logo.svg";
import Image from 'next/image';

export default function RegisterError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // return <ErrorCard errorMessage={error.message} reset={reset} />;
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
                <ErrorCard errorMessage={error.message} reset={reset} />
            </Box>
        </Stack>
    )
}