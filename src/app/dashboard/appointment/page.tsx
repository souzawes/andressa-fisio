"use client"

import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { getPatients } from '../../../services/databaseService';

// import { gql, useSuspenseQuery, TypedDocumentNode } from '@apollo/client';

// const query = gql`
//     query {
//         characters(page: 1) {
//           results {
//             id
//             name
//             image
//           }
//         }
//       }
// `;

interface Patient {
    id: string;
    name: string;
    cpf: string | null;
    address: string | null;
    neighborhood: string | null;
    number_house: string | null;
    date_of_birth: Date;
    sex: string | null;
    civil_state: string | null;
    job: string | null;
}

interface Appointment {
    patient_id: string;

}

async function getPatients(): Promise<Patient[]> {
    try {
        const response = await fetch('/api/patient');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.patients;
    } catch (error) {
        console.error('Failed to fetch patients:', error);
        return [];
    }
}

async function getPatientById(id: string): Promise<Patient | null> {
    try {
        const response = await fetch(`/api/patient/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.patient;
    } catch (error) {
        console.error('Failed to fetch patient:', error);
        return null;
    }
}


const Appointment: React.FC = () => {

    // const { data } = useSuspenseQuery(query)


    const [formData, setFormData] = useState({
        patient: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false)

    useEffect(() => {
        const fetchPatients = async () => {
            const patientsData = await getPatients();
            setPatients(patientsData);
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        setAllFieldsFilled(
            selectedDate != null &&
            selectedStartTime != null &&
            selectedEndTime != null
        )
    }, [selectedDate, selectedStartTime, selectedEndTime])


    const handleChangePatient = (event: SelectChangeEvent) => {
        setSelectedPatient(event.target.value as string);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário para o backend
        console.log(formData);
    };

    return (
        <Container>
            {/* {data.characters.results.map((character: any) => (
                <div key={character.id}> {character.name}</div>
            ))} */}
            <Typography variant='h4' color='primary' align='center' gutterBottom mb={10}>
                Marcar Consulta
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item md={12} lg={12} xl={12}>
                        <FormControl fullWidth>
                            <InputLabel id="patient">Selecione o paciente</InputLabel>
                            <Select
                                labelId="patient"
                                id="demo-simple-select"
                                value={selectedPatient!}
                                label="Selecione o paciente"
                                onChange={handleChangePatient}
                            >
                                {/* <MenuItem key={0} value={0}>(Nenhum)</MenuItem> */}
                                {patients.map((patient) => (
                                    <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DatePicker
                                label="Data da Consulta"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                            />

                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Hora de início"
                                value={selectedStartTime}
                                onChange={(newValue) => setSelectedStartTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Hora de término"
                                value={selectedEndTime}
                                onChange={(newValue) => setSelectedEndTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={((selectedPatient != null) && allFieldsFilled) ? false : true}
                        sx={{ ml: 'auto', mr: 'auto', mt: 10 }}>
                        Agendar Consulta
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}

export default Appointment;