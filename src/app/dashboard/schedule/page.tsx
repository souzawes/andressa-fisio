"use client"

import { Box, Paper, TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    DateNavigator,
    TodayButton,
    Toolbar,
    ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';


import theme from '@/theme/Theme';


import appointments from '@/utils/today-appoitment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import HeaderPages from '@/components/HearderPages/HeaderPages';
import { Stack, TextFieldProps } from '@mui/material';
interface Appointment {
    date: string,
    end_time: string,
    id: string,
    patient_id: string,
    start_time: string,
    type: string
};

interface AppointmentSchedule {
    startDate: Date,
    endDate: Date,
    title?: string,
    allDay?: boolean,
    id: string,
    rrule?: string,
    exDate?: string
};

const PREFIX = "Demo";
// const namesPatients: string[] = []
const namesPatients: { [key: string]: string } = {};

const Schedule = () => {

    const [appoitments, setAppointments] = useState([])
    const [appoitmenttSchedule, setAppointmentSchedule] = useState<AppointmentSchedule[] | undefined>(undefined)

    const [data, setData] = useState(appointments);
    const [currentDate, setCurrentDate] = useState(Date.now);
    const [appointmentHasUpdate, setAppointmentHasUpdate] = useState<boolean>(false)
    const [appointmentHasEdited, setAppointmentHasEdited] = useState<boolean>(false)

    const [namePatient, setNamePatient] = useState<string[] | null>(null)

    const [chandedId, setChangedId] = useState<string[] | null>(null)

    useEffect(() => {
        setAppointmentHasEdited(false)
        const fetchAppointments = async () => {
            const res = await fetch(`/api/appointment`);
            const data = await res.json();
            // setAppointment(data.appointments);
            const fetchedAppointments = data.appointments;

            const appointmentSchedules = await Promise.all(fetchedAppointments.map(async (appointment: Appointment) => {
                const { id, patient_id, date, start_time, end_time } = appointment;
                const startTime = new Date(start_time)
                // startTime.setTime(startTime.getTime() + startTime.getTimezoneOffset() * 60 * 1000)

                const endTime = new Date(end_time)
                // endTime.setTime(endTime.getTime() + endTime.getTimezoneOffset() * 60 * 1000)

                const dateBase = new Date(date)
                dateBase.setTime(dateBase.getTime() + dateBase.getTimezoneOffset() * 60 * 1000)

                const startDate = moment(dateBase)
                    .hour(startTime.getHours())
                    .minutes(startTime.getMinutes())
                    .toDate();

                const endDate = moment(dateBase)
                    .hour(endTime.getHours())
                    .minutes(endTime.getMinutes())
                    .toDate();

                if (!namesPatients[patient_id]) {
                    const res = await fetch(`/api/patient/${patient_id}`);
                    const dataPatient = await res.json();
                    namesPatients[patient_id] = dataPatient.patient.name;
                }

                const title = `Consulta de ${namesPatients[patient_id]}`;

                return {
                    startDate,
                    endDate,
                    title,
                    id
                };
            }));
            setAppointments(fetchedAppointments);
            setAppointmentSchedule(appointmentSchedules);
        }
        fetchAppointments();
    }, [appointmentHasEdited]);

    const handleCurrentDateChange = (newDate: any) => {
        setCurrentDate(newDate);
    };

    const classes = {
        todayCell: `${PREFIX}-todayCell`,
        weekendCell: `${PREFIX}-weekendCell`,
        today: `${PREFIX}-today`,
        weekend: `${PREFIX}-weekend`,
    };

    const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
        [`&.${classes.todayCell}`]: {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.14),
            },
            '&:focus': {
                backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
        },
        [`&.${classes.weekendCell}`]: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            '&:hover': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            },
            '&:focus': {
                backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
            },
        },
    }));

    const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
        [`&.${classes.today}`]: {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
        [`&.${classes.weekend}`]: {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
        },
    }));


    const TimeTableCell = (props: any) => {
        const { startDate } = props;
        const date = new Date(startDate);

        if (date.getDate() === new Date().getDate()) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} onDoubleClick={undefined} />;
        } if (date.getDay() === 0 || date.getDay() === 6) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
        } return <StyledWeekViewTimeTableCell {...props} onDoubleClick={undefined} />;
    };

    const DayScaleCell = (props: any) => {
        const { startDate, today } = props;

        if (today) {
            return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
        }
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            return (
                <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />
            );
        }
        return <StyledWeekViewDayScaleCell {...props} />;
    };

    interface ChangedSet {
        added?: { [key: string]: any }
        changed?: { [key: string]: AppointmentSchedule }
        deleted?: number | string
    }

    const updateAppoitment = async (appointment: AppointmentSchedule | undefined) => {
        if (!appointment) return; // Verifica se o appointment é válido

        const { id, startDate, endDate } = appointment;


        // const date = startDate.toISOString().split('T')[0]; // Extrai a data (AAAA-MM-DD)
        const start_time = startDate.toISOString();
        const end_time = endDate.toISOString();
        try {
            const res = await fetch(`/api/appointment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, start_time, end_time })
            });

            if (res.ok) {
                const result = await res.json();
                console.log(result.message);
                return result;
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao atualizar o compromisso');
            }
        } catch (error) {
            console.error(`Error ${error}`);
            throw error
        }
    }

    function commitChanges({ changed }: ChangedSet) {

        if (changed) {
            setChangedId(Object.keys(changed))
            let dataChanged =
                appoitmenttSchedule?.map(appointments => (
                    changed[appointments.id] ? { ...appointments, ...changed[appointments.id] } : appointments
                ))
            setAppointmentSchedule(dataChanged)
            setAppointmentHasUpdate(true)
        }
    };

    useEffect(() => {
        if (appointmentHasUpdate) {
            appoitmenttSchedule?.map(appointment => {
                if (appointment.id === chandedId!![0]) {
                    const response = updateAppoitment(appointment)
                }
            })
        }
    }, [appointmentHasUpdate, appoitmenttSchedule, chandedId])

    // const Appointment: React.FC<Appointments.AppointmentProps> = ({
    //     children, style, ...restProps
    // }) => (
    //     <Appointments.Appointment
    //         {...restProps}
    //         style={{
    //             ...style,
    //             backgroundColor: '#0095A1',
    //             borderRadius: '8px',
    //         }}
    //     >
    //         {children}
    //     </Appointments.Appointment>
    // );

    interface BasicLayoutProps {
        readOnly?: boolean
        appointmentData: AppointmentSchedule
        appointmentResources: Array<any>
        onFieldChange: (nextFieldValue: { [fieldName: string]: any }) => void
    }

    const TextEditor = (props: AppointmentForm.TextEditorProps) => {
        // eslint-disable-next-line react/destructuring-assignment
        if (props.type === 'multilineTextEditor') {
            return null;
        }

        // if (props.type === 'titleTextEditor') {
        //     props.readOnly = true
        // }

        return <AppointmentForm.TextEditor{...props} />;
    };

    const BooleanEditor = (props: AppointmentForm.BooleanEditorProps) => {
        if (props.label === 'All Day' || props.label === 'Repeat') {
            return null;
        }
        return <AppointmentForm.BooleanEditor {...props} />;
    };

    const LabelComponent = (props: AppointmentForm.LabelProps) => {
        if (props.text === 'More Information') {
            return null;
        }
        return <AppointmentForm.Label readOnly={true} {...props} />
    };

    const DateEditorComponent = (props: AppointmentForm.DateEditorProps) => {
        const handleDateChange = (value: Date | null, keyboardInputValue?: string) => {
            if (value !== null) {
                // Lógica para lidar com um valor de data válido
                console.log("Data selecionada:", value);
            } else {
                // Lógica para lidar com um valor nulo
                console.log("Data removida ou inválida");
            }
        };

        const handleTimeChange = (nextValue: Date) => {
            const hours = nextValue.getHours;
            const minutes = nextValue.getMinutes;
            console.log(`Horas selecionadas: ${hours}:${minutes}`);
        };

        const handleTimeChangeWrapper = (value: Date | null) => {
            if (value && props.onValueChange) {
                props.onValueChange(value);
            }
        };

        return (
            // <AppointmentForm.DateEditor readOnly={false} {...props} />
            <Box
                sx={{
                    display: 'flex'
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        value={props.value}
                        onChange={handleTimeChangeWrapper}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>
        );
    };

    const BasicLayout = ({ onFieldChange, appointmentData, booleanEditorComponent, labelComponent, dateEditorComponent, ...restProps }: AppointmentForm.BasicLayoutProps) => {
        return (
            <AppointmentForm.BasicLayout
                appointmentData={appointmentData}
                onFieldChange={onFieldChange}
                booleanEditorComponent={BooleanEditor}
                labelComponent={LabelComponent}
                dateEditorComponent={DateEditorComponent}
                {...restProps}
            />
        );
    }

    // const handleCommitButtonClick = ({ props...}) => {
    //     setAppointmentHasEdited(true)
    // }

    // const CommandLayout = ({ onCommitButtonClick, ...restProps }: AppointmentForm.CommandLayoutProps) => {
    //     return (
    //         <AppointmentForm.CommandLayout
    //             onCommitButtonClick={handleCommitButtonClick}
    //             {...restProps}
    //         />
    //     );
    // };


    return (
        <Stack sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <HeaderPages title='Calendário' backButton={true}></HeaderPages>
            <Paper sx={{ height: '80vh' }}>
                <Scheduler
                    data={appoitmenttSchedule}
                    locale={"pt-BR"}

                >
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={handleCurrentDateChange}
                    />
                    <EditingState
                        onCommitChanges={commitChanges}
                    />
                    <IntegratedEditing />
                    <ConfirmationDialog />
                    <WeekView
                        startDayHour={9}
                        endDayHour={19}
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={DayScaleCell}
                    />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <Appointments
                    // appointmentComponent={Appointment}
                    />
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                    />
                    <AppointmentForm
                        // messages={}
                        basicLayoutComponent={BasicLayout}
                        textEditorComponent={TextEditor}
                    // commandLayoutComponent={CommandLayout}
                    />
                </Scheduler>
            </Paper>
        </Stack>

    );
}

export default Schedule;