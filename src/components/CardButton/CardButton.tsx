import { Card, Grid, CardActionArea, Typography } from "@mui/material";
import { ReactNode } from "react";
import Link from 'next/link';

interface CardButtonProps {
  icon: ReactNode;
  title: string;
  link: string;
  index: number;
}

const CardButton: React.FC<CardButtonProps> = ({ icon, title, link, index }) => {

  return (
    <Grid
      item
      key={index}
      xs={12}
      sm={6}
      md={4}
      display="flex"
      alignItems="center"
      flexDirection="column"
      rowGap="10px"
    >
      <Link href={link}
        style={{ display: "flex", width: '100%' }}>
        <Card
          key={index}
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#E0E0E0",
            width: "100%",
            height: "125px",
            borderRadius: "10px",
            boxShadow: "0px 0px 4px 0.5px #7691A0",
          }}
        >
          <CardActionArea
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </CardActionArea>
        </Card>
      </Link>

      <Typography variant="h6" color="#0B3948">{title}</Typography>
    </Grid>
  );
};

export default CardButton;
