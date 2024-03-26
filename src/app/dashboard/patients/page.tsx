import CardButton from "@/components/CardButton/CardButton";
import GradientIcon from "@/components/GradientIcon/GradientIcon";
import { Grid } from "@mui/material";

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';




const Patients = () => {

  const cardButtonsPatients = [
    {
      icon: <GradientIcon icon={<PersonAddAltOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Cadastrar Paciente",
      link: 'patients/register'
    },
    {
      icon: <GradientIcon icon={<EditNoteOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Histórico do Paciente",
      link: 'patients/history'
    },
    {
      icon: <GradientIcon icon={<ListAltOutlinedIcon sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
      title: "Lista de pacientes",
      link: 'patients/list'
    },
  ]

  return (
    <Grid
      width="80vw"
      height="80%"
      container
      columnSpacing={4}
      alignItems="center"
      justifyContent="center"
      rowSpacing={0}
    >
      {cardButtonsPatients.map((cardButon, index) => {
        return <CardButton icon={cardButon.icon} title={cardButon.title} link={cardButon.link} index={index} />;
      })}
    </Grid>
  );
}

export default Patients;