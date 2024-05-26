import CardButton from '@/components/CardButton/CardButton';
import GradientIcon from '@/components/GradientIcon/GradientIcon';
import { GroupAddOutlined, ListAltOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';



const History = () => {

    const cardButtonsPatients = [
        {
            icon: <GradientIcon icon={<GroupAddOutlined sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
            title: "Cadastrar Novo Grupo",
            link: 'managergroup/register'
        },
        {
            icon: <GradientIcon icon={<ListAltOutlined sx={{ width: 72, height: 72, fill: "url(#gradientColors)" }} />} />,
            title: "Lista de Grupos",
            link: 'managergroup/list'
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
                return <CardButton key={index} icon={cardButon.icon} title={cardButon.title} link={cardButon.link} index={index} />;
            })}
        </Grid>
    );
}

export default History;