
import { Grid } from "@mui/material";
import CardButton from "@/components/CardButton/CardButton";
import GradientIcon from "@/components/GradientIcon/GradientIcon";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

import { getClient } from '../../lib/client';
import { gql } from "@apollo/client";

async function loadData() {
  const { data } = await getClient().query({
    query: gql`
      query {
        characters(page: 1) {
          results {
            id
            name
            image
          }
        }
      }
    `
  })
  return data.characters.results
  // console.log(data.characters.results)
}

const DashBoard = async () => {

  const cardButonsHome = [
    {
      icon: <GradientIcon icon={<PersonOutlineOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Paciente",
      link: 'dashboard/patients'
    },
    {
      icon: <GradientIcon icon={<CalendarMonthOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Agenda",
      link: 'dashboard/schedule'
    },
    {
      icon: <GradientIcon icon={<LocalHospitalOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Marcar procedimento",
      link: 'dashboard/appointment'
    },
    {
      icon: <GradientIcon icon={<GroupsOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Gerenciador de Grupos",
      link: 'dashboard/managergroup'
    },
    {
      icon: <GradientIcon icon={<FitnessCenterOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Ficha de avaliação física",
      link: 'dashboard/avaliation'
    },
    {
      icon: <GradientIcon icon={<PaidOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Finanças",
      link: 'dashboard/finance'
    },
  ];

  // const characters = await loadData();

  return (
    <Grid
      width="80vw"
      height="80%"
      maxWidth="1400px"
      container
      columnSpacing={4}

      alignItems="center"
    >
      {cardButonsHome.map((cardButon, index) => {
        return <CardButton key={index} icon={cardButon.icon} title={cardButon.title} link={cardButon.link} index={index} />;
      })}

    </Grid>
  );
};

export default DashBoard;
