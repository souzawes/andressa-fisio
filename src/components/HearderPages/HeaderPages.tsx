// components/HeaderPages.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

interface HeaderPagesProps {
    title: string;
    backButton?: boolean;
}

const HeaderPages: React.FC<HeaderPagesProps> = ({ title, backButton = false }) => {
    const router = useRouter();

    const handleBackClick = () => {
        router.back()
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: '24px', mb: '16px', mt: '16px' }}>
            {backButton && (
                <IconButton edge="start" color="inherit" aria-label="back" onClick={handleBackClick}>
                    <ArrowBackIosNewOutlinedIcon />
                </IconButton>
            )}
            <Typography variant="h5" style={{ flexGrow: 1 }} sx={{ ml: '24px' }} color="#0B3948">
                {title}
            </Typography>
        </Box>


    );
};

export default HeaderPages;
