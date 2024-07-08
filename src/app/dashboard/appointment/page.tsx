"use client"

import {
    Alert,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Stack,
    TextField
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormEvent, useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import HeaderPages from '@/components/HearderPages/HeaderPages';

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

async function postAppointment(appointmentData: any) {
    try {
        const response = await fetch('/api/appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            return result
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao agendar a consulta');
        }
    } catch (error) {
        console.error('Erro ao agendar a consulta', error);
        throw error;
    }
}



const Appointment: React.FC = () => {

    // const { data } = useSuspenseQuery(query)

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<Dayjs | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<Dayjs | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null);
    const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            selectedEndTime != null &&
            selectedStartTime!.isBefore(selectedEndTime!, 'minutes')
        )
    }, [selectedDate, selectedStartTime, selectedEndTime])


    const handleChangePatient = (event: SelectChangeEvent) => {
        setSelectedPatient(event.target.value as string);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const combinedStartTime = selectedDate?.hour(selectedStartTime?.hour()!).minute(selectedStartTime?.minute()!);
        const combinedEndTime = selectedDate?.hour(selectedEndTime?.hour()!).minute(selectedEndTime?.minute()!);

        const appointmentData = {
            patient_id: selectedPatient,
            date: selectedDate,
            start_time: combinedStartTime,
            end_time: combinedEndTime,
            type: "Padrão"
        };

        try {
            const result = await postAppointment(appointmentData)
            console.log("Constulta agendada com sucesso: ", result.message)
            setSuccessMessage('Consulta agendada com sucesso!');
            setErrorMessage(null);
            clearAllFieldsRegisterForm()
        } catch (error) {
            console.error('Erro ao agendar a consulta', error);
            setErrorMessage('Erro ao agendar a consulta');
            setSuccessMessage(null);
        }
    };

    function clearAllFieldsRegisterForm() {
        setSelectedPatient(null);
        setSelectedDate(null);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setAllFieldsFilled(false);
    }

    const handleStartTimeChange = (newValue: Dayjs | null) => {
        setSelectedStartTime(newValue);
        if (newValue && selectedEndTime && newValue.isAfter(selectedEndTime, 'minutes')) {
            setTimeError('A hora de início não pode ser posterior à hora de término');
        } else if (newValue && selectedEndTime && newValue.isSame(selectedEndTime, 'minutes')) {
            setTimeError('A hora de início não pode ser igual à hora de término')
        }
        else {
            setTimeError(null);
        }
    };

    const handleEndTimeChange = (newValue: Dayjs | null) => {
        setSelectedEndTime(newValue);
        if (selectedStartTime && newValue && newValue.isBefore(selectedStartTime, 'minutes')) {
            setTimeError('A hora de término não pode ser anterior à hora de início');
        } else if (newValue && selectedStartTime && newValue.isSame(selectedStartTime, 'minutes')) {
            setTimeError('A hora de término não pode ser igual à hora de início')
        }
        else {
            setTimeError(null);
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', height: '80%' }}>
            <HeaderPages title={'Marcar procedimento'} backButton={true} />
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
                                {patients.map((patient) => (
                                    <MenuItem key={patient.id} value={patient.id}>{patient.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

                            <DatePicker
                                label="Data da Consulta"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                                minDate={dayjs()}
                            />

                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <TimePicker
                                label="Hora de início"
                                value={selectedStartTime}
                                onChange={handleStartTimeChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item md={4} lg={4} xl={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br"  >
                            <TimePicker
                                label="Hora de término"
                                value={selectedEndTime}
                                onChange={handleEndTimeChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                disabled={(selectedPatient == null) ? true : false}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                {timeError && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                        {timeError}
                    </Typography>
                )}
                <Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleSubmit}
                        disabled={((selectedPatient != null) && allFieldsFilled) ? false : true}
                        sx={{ ml: 'auto', mr: 'auto', mt: 10 }}>
                        Agendar Consulta
                    </Button>
                </Stack>
            </form>
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
            >
                <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(null)}
            >
                <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Appointment;