"use client"

import {
    Alert,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Snackbar,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormEvent, use, useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import HeaderPages from '@/components/HearderPages/HeaderPages';

const DAYS = [
    {
        key: "sunday",
        label: "Domingo"
    },
    {
        key: "monday",
        label: "Segunda"
    },
    {
        key: "tuesday",
        label: "Terça"
    },
    {
        key: "wednesday",
        label: "Quarta"
    },
    {
        key: "thursday",
        label: "Quinta"
    },
    {
        key: "friday",
        label: "Sexta"
    },
    {
        key: "saturday",
        label: "Sábado"
    }
];

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

interface Class {
    id: string;
    name: string;
    creation_date: Date;
};

interface Appointment {
    patient_id: string;

}

async function getClasses(): Promise<Class[]> {
    try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json();
        return data.classes
    } catch (error) {
        console.error('Failed to fetch classes:', error);
        return [];
    }
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

async function postRecurringSession(recurringSessionData: any) {
    try {
        const response = await fetch('/api/recurring_sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recurringSessionData)
        });

        if (response.ok) {
            const result = await response.json();
            return result
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao agendar as sessões');
        }
    } catch (error) {
        console.error('Erro ao agendar sessões', error);
        throw error;
    }
}



const Appointment: React.FC = () => {

    // const { data } = useSuspenseQuery(query)

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedDateAppointment, setSelectedDateAppointment] = useState<Dayjs | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedStartTimeAppointment, setSelectedStartTimeAppointment] = useState<Dayjs | null>(null);
    const [selectedEndTimeAppointment, setSelectedEndTimeAppointment] = useState<Dayjs | null>(null);
    const [timeError, setTimeError] = useState<string | null>(null);

    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null)
    const [daysOfWeekSelected, setDaysOfWeekSelected] = useState<string[] | null>(null)
    const [selectedStartDateRecurringSession, setSelectedStartDateRecurringSession] = useState<Dayjs | null>(null);
    const [selectedStartTimeRecurringSession, setSelectedStartTimeRecurringSession] = useState<Dayjs | null>(null);
    const [selectedEndTimeRecurringSession, setSelectedEndTimeRecurringSession] = useState<Dayjs | null>(null);

    const [allFieldsFilledAppointment, setAllFieldsFilledAppointment] = useState<boolean>(false)
    const [allFieldsFilledRecurringSession, setAllFieldsFilledRecurringSession] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [proceeding, setProceeding] = useState<string | null>('appointment');

    useEffect(() => {
        const fetchPatients = async () => {
            const patientsData = await getPatients();
            setPatients(patientsData);
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            const classesData = await getClasses();
            setClasses(classesData);
        };
        fetchClasses();
    }, [])

    useEffect(() => {
        setAllFieldsFilledAppointment(
            selectedDateAppointment != null &&
            selectedStartTimeAppointment != null &&
            selectedEndTimeAppointment != null &&
            selectedStartTimeAppointment!.isBefore(selectedEndTimeAppointment!, 'minutes')
        )
    }, [selectedDateAppointment, selectedStartTimeAppointment, selectedEndTimeAppointment])

    useEffect(() => {
        setAllFieldsFilledRecurringSession(
            selectedClasse != null &&
            setDaysOfWeekSelected.length != 0 &&
            selectedStartTimeRecurringSession != null &&
            selectedEndTimeRecurringSession != null
        )
    }, [selectedClasse, selectedStartTimeRecurringSession, selectedEndTimeRecurringSession])


    const handleChangePatient = (event: SelectChangeEvent) => {
        setSelectedPatient(event.target.value as string);
    };

    const handleChangeClass = (event: SelectChangeEvent) => {
        setSelectedClasse(event.target.value as string);
    };
    const handleDaysOfWeek = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
        setDaysOfWeekSelected(newDays)
    };

    const handleSubmitAppointment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const combinedStartTime = selectedDateAppointment?.hour(selectedStartTimeAppointment?.hour()!).minute(selectedStartTimeAppointment?.minute()!);
        const combinedEndTime = selectedDateAppointment?.hour(selectedEndTimeAppointment?.hour()!).minute(selectedEndTimeAppointment?.minute()!);

        const appointmentData = {
            patient_id: selectedPatient,
            date: selectedDateAppointment,
            start_time: combinedStartTime,
            end_time: combinedEndTime,
            type: "Padrão"
        };

        try {
            const result = await postAppointment(appointmentData)
            console.log("Constulta agendada com sucesso: ", result.message)
            setSuccessMessage('Consulta agendada com sucesso!');
            setErrorMessage(null);
            clearAllFieldsRegisterFormAppointment()
        } catch (error) {
            console.error('Erro ao agendar a consulta', error);
            setErrorMessage('Erro ao agendar a consulta');
            setSuccessMessage(null);
        }
    };

    const handleSubmitRecurringSession = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const startTime = selectedStartDateRecurringSession?.hour(selectedStartTimeRecurringSession?.hour()!).minute(selectedStartTimeRecurringSession?.minute()!);
        const endTime = selectedStartDateRecurringSession?.hour(selectedEndTimeRecurringSession?.hour()!).minute(selectedEndTimeRecurringSession?.minute()!);

        const endDate = selectedStartDateRecurringSession?.add(1, 'year')

        var ocuurenceDaysOfWeek = daysOfWeek()

        const rrule = `FREQ=WEEKLY;WKST=SU;BYDAY=${ocuurenceDaysOfWeek};UNTIL=${endDate?.format('YYYYMMDD[T]HHmmss[Z]')}`

        // rRule: "FREQ=WEEKLY;BYDAY=MO,TH;WKST=SU;UNTIL=20180614T235959Z",

        const recurringSessionData = {
            class_id: selectedClasse,
            start_date: selectedStartDateRecurringSession,
            end_date: endDate,
            start_time: startTime,
            end_time: endTime,
            recurrence_pattern: "",
            recurrence_interval: 0,
            ocuurence_days_of_week: ocuurenceDaysOfWeek,
            rrule: rrule
        }

        try {
            const result = await postRecurringSession(recurringSessionData)
            console.log("Sessões agendadas com sucesso: ", result.message)
            setSuccessMessage('Sessões agendadas com sucesso!');
            setErrorMessage(null);
            clearAllFieldsRegisterFormRecurringSession();
        } catch (error) {
            console.error('Erro ao agendar as sessões', error);
            setErrorMessage('Erro ao agendar as sessões');
            setSuccessMessage(null);
        }

    }
    const daysWeek: { [key: string]: string } = {
        '0': 'SU',
        '1': 'MO',
        '2': 'TU',
        '3': 'WE',
        '4': 'TH',
        '5': 'FR',
        '6': 'SA'
    }

    function daysOfWeek(): string {
        const days = daysOfWeekSelected!.sort();
        var ocuurenceDays = days
            .map(day => daysWeek[day])
            .join(',')
        return ocuurenceDays
    }

    function clearAllFieldsRegisterFormAppointment() {
        setSelectedPatient(null);
        setSelectedDateAppointment(null);
        setSelectedStartTimeAppointment(null);
        setSelectedEndTimeAppointment(null);
        setAllFieldsFilledAppointment(false);
    }

    function clearAllFieldsRegisterFormRecurringSession() {
        setSelectedClasse(null);
        setDaysOfWeekSelected(null);
        setSelectedStartDateRecurringSession(null);
        setSelectedStartTimeRecurringSession(null);
        setSelectedEndTimeRecurringSession(null);
    }

    const handleStartTimeChangeAppointment = (newValue: Dayjs | null) => {
        setSelectedStartTimeAppointment(newValue);
        if (newValue && selectedEndTimeAppointment && newValue.isAfter(selectedEndTimeAppointment, 'minutes')) {
            setTimeError('A hora de início não pode ser posterior à hora de término');
        } else if (newValue && selectedEndTimeAppointment && newValue.isSame(selectedEndTimeAppointment, 'minutes')) {
            setTimeError('A hora de início não pode ser igual à hora de término')
        }
        else {
            setTimeError(null);
        }
    };

    const handleEndTimeChangeAppointment = (newValue: Dayjs | null) => {
        setSelectedEndTimeAppointment(newValue);
        if (selectedStartTimeAppointment && newValue && newValue.isBefore(selectedStartTimeAppointment, 'minutes')) {
            setTimeError('A hora de término não pode ser anterior à hora de início');
        } else if (newValue && selectedStartTimeAppointment && newValue.isSame(selectedStartTimeAppointment, 'minutes')) {
            setTimeError('A hora de término não pode ser igual à hora de início')
        }
        else {
            setTimeError(null);
        }
    };

    const handleStartTimeChangeRecurringSession = (newValue: Dayjs | null) => {
        setSelectedStartTimeRecurringSession(newValue);
    };

    const handleEndTimeChangeRecurringSession = (newValue: Dayjs | null) => {
        setSelectedEndTimeRecurringSession(newValue);
    };


    const handleChangeProceeding = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProceeding((event.target as HTMLInputElement).value)
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', height: '80%' }}>
            <HeaderPages title={'Marcar procedimento'} backButton={true} />
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={proceeding}
                    onChange={handleChangeProceeding}
                >
                    <FormControlLabel value="appointment" control={<Radio />} label="Consulta" />
                    <FormControlLabel value="recurring_session" control={<Radio />} label="Sessões recorrentes" />
                </RadioGroup>
            </FormControl>
            {(proceeding == 'appointment') &&
                <form onSubmit={handleSubmitAppointment}>
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
                                    value={selectedDateAppointment}
                                    onChange={(newValue) => setSelectedDateAppointment(newValue)}
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
                                    value={selectedStartTimeAppointment}
                                    onChange={handleStartTimeChangeAppointment}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    disabled={(selectedPatient == null) ? true : false}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={4} lg={4} xl={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br"  >
                                <TimePicker
                                    label="Hora de término"
                                    value={selectedEndTimeAppointment}
                                    onChange={handleEndTimeChangeAppointment}
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
                            onClick={() => handleSubmitAppointment}
                            disabled={((selectedPatient != null) && allFieldsFilledAppointment) ? false : true}
                            sx={{ ml: 'auto', mr: 'auto', mt: 10 }}>
                            Agendar Consulta
                        </Button>
                    </Stack>
                </form>

            }
            {(proceeding == 'recurring_session') &&
                <form onSubmit={handleSubmitRecurringSession}>
                    <Grid container spacing={3}>
                        <Grid item md={12} lg={12} xl={12}>
                            <FormControl fullWidth>
                                <InputLabel id="group">Selecione o grupo</InputLabel>
                                <Select
                                    labelId="group"
                                    id="demo-simple-select"
                                    value={selectedClasse!}
                                    label="Selecione o grupo"
                                    onChange={handleChangeClass}
                                >
                                    {classes.map((classe) => (
                                        <MenuItem key={classe.id} value={classe.id}>{classe.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <ToggleButtonGroup
                            value={daysOfWeekSelected}
                            onChange={handleDaysOfWeek}
                            disabled={(selectedClasse == null) ? true : false}
                            sx={{
                                gap: 5,
                                mt: 2, mr: 'auto',
                                ml: 'auto'
                            }}>
                            {DAYS.map((day, index) => (
                                <ToggleButton key={day.key} value={index}>
                                    <Typography variant='h6'>{day.label}</Typography>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        <Grid item md={4} lg={4} xl={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

                                <DatePicker
                                    label="Data de início das sessões"
                                    value={selectedStartDateRecurringSession}
                                    onChange={(newValue) => setSelectedStartDateRecurringSession(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    disabled={(selectedClasse == null) ? true : false}
                                    minDate={dayjs()}
                                />

                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={4} lg={4} xl={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br"  >
                                <TimePicker
                                    label="Hora de início"
                                    value={selectedStartTimeRecurringSession}
                                    onChange={handleStartTimeChangeRecurringSession}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    disabled={(selectedClasse == null) ? true : false}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={4} lg={4} xl={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br"  >
                                <TimePicker
                                    label="Hora de término"
                                    value={selectedEndTimeRecurringSession}
                                    onChange={handleEndTimeChangeRecurringSession}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    disabled={(selectedClasse == null) ? true : false}
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
                            onClick={() => handleSubmitRecurringSession}
                            disabled={((selectedClasse != null) && allFieldsFilledRecurringSession) ? false : true}
                            sx={{ ml: 'auto', mr: 'auto', mt: 10 }}>
                            Agendar horários da turma
                        </Button>
                    </Stack>
                </form>
            }
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