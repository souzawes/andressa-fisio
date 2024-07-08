'use client';

import { Card, CardContent, CardHeader, Button, Box, Typography } from '@mui/material';

import Link from 'next/link';

export default function ErrorCard({
    errorMessage,
    reset,
}: {
    errorMessage: string;
    reset: () => void;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: '24px'
            }}
        >
            <Typography variant='h3'>Opss...</Typography>
            <Typography variant='body1'>{errorMessage}</Typography>

            <Button
                variant="contained"
                onClick={reset}
                sx={{
                    backgroundColor: "#0B3948",
                    width: "170px",
                    height: "50px",
                    borderRadius: "20px",
                    textTransform: "capitalize",
                }}
            >
                Tentar novamente
            </Button>
        </Box>
    );
}