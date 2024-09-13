"use client"

import { Box, Paper, TextField } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { ViewState, EditingState, IntegratedEditing, AppointmentsProps } from '@devexpress/dx-react-scheduler';
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
    EditRecurrenceMenu,
    Resources
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
import { text } from 'micro';
interface Appointment {
    date: string,
    end_time: string,
    id: string,
    patient_id: string,
    start_time: string,
    type: string
};

interface RecurringSession {
    id: string,
    class_id: string,
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string,
    recurrence_pattern: string,
    recurrence_interval: number,
    ocuurence_days_of_week: string,
    rrule: string
}

interface AppointmentSchedule {
    startDate: Date,
    endDate: Date,
    title?: string,
    allDay?: boolean,
    id: string,
    rRule?: string,
    exDate?: string
    type?: string
};

const PREFIX = "Demo";
// const namesPatients: string[] = []
const namesPatients: { [key: string]: string } = {};
const namesClasses: { [key: string]: string } = {};

const Schedule = () => {

    const [appoitments, setAppointments] = useState<AppointmentSchedule[]>([])
    const [recurringSessions, setRecurringSessions] = useState<AppointmentSchedule[]>([])
    const [appoitmenttSchedule, setAppointmentSchedule] = useState<AppointmentSchedule[]>([])

    const [data, setData] = useState(appointments);
    const [currentDate, setCurrentDate] = useState(Date.now);
    const [appointmentHasUpdate, setAppointmentHasUpdate] = useState<boolean>(false)
    const [appointmentHasEdited, setAppointmentHasEdited] = useState<boolean>(false)
    const [appointmentHasDeleted, setAppointmentHasDeleted] = useState<boolean>(false)

    const [chandedId, setChangedId] = useState<string[] | null>(null)
    const [deletedId, setDeletedId] = useState<string | null>(null)


    var _appointmentsSchedules: any[] = []
    var _recurringSessionsSchedules: any[] = []

    const removeDuplicates = (data: AppointmentSchedule[]) => {
        const uniqueData = data.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.id === item.id
            ))
        );
        return uniqueData;
    };

    useEffect(() => {
        setAppointmentHasEdited(false)

        const fetchAppointments = async () => {
            const res = await fetch(`/api/appointment`);
            const data = await res.json();
            const fetchedAppointments = data.appointments;

            const appointmentSchedules = await Promise.all(fetchedAppointments.map(async (appointment: Appointment) => {
                const { id, patient_id, date, start_time, end_time } = appointment;
                const startTime = new Date(start_time)
                const endTime = new Date(end_time)
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

                const type = 'appointment'

                const title = `Consulta de ${namesPatients[patient_id]}`;
                const dataAppointment: AppointmentSchedule = {
                    startDate,
                    endDate,
                    title,
                    id,
                    type
                }
                return dataAppointment
            }));
            setAppointments(fetchedAppointments);
            setAppointmentSchedule((prevData) => (removeDuplicates([...prevData, ...appointmentSchedules])));
        }
        fetchAppointments();

        const fetchRecurringSessions = async () => {
            const res = await fetch(`/api/recurring_sessions`)
            const data = await res.json();
            const fetchedRecurringSessions = data.recurring_session;

            const recurringSessionsSchedules = await Promise.all(fetchedRecurringSessions.map(async (recurringSession: RecurringSession) => {
                const { id, class_id, start_date, start_time, end_time, rrule } = recurringSession;

                const startTime = new Date(start_time)
                const endTime = new Date(end_time)
                const date = new Date(start_date)
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

                if (!namesClasses[class_id]) {
                    const res = await fetch(`/api/classes/${class_id}`);
                    const dataClass = await res.json();
                    namesClasses[class_id] = dataClass.classe.name;
                }

                const type = 'recurring_session'
                const title = `Sessão - ${namesClasses[class_id]}`
                const dataRecurringSession: AppointmentSchedule = {
                    startDate,
                    endDate,
                    title,
                    id,
                    rRule: rrule,
                    type
                }
                return dataRecurringSession
            }));
            setRecurringSessions(fetchedRecurringSessions)
            setAppointmentSchedule((prevData) => (removeDuplicates([...prevData, ...recurringSessionsSchedules])))
        }
        fetchRecurringSessions();
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
        if (!appointment) return;
        const { id, startDate, endDate } = appointment;
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

    const deleteAppointment = async (id: string) => {

        try {

            const res = await fetch(`/api/appointment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                const result = await res.json();
                console.log(result.message);
                return result;
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erro ao excluir o compromisso');
            }
        } catch (error) {
            console.error(`Error ${error}`);
            throw error
        }
    }

    async function commitChanges({ changed, deleted }: ChangedSet) {

        if (changed) {
            setChangedId(Object.keys(changed))
            let dataChanged =
                appoitmenttSchedule?.map(appointments => (
                    changed[appointments.id] ? { ...appointments, ...changed[appointments.id] } : appointments
                ))
            setAppointmentSchedule(dataChanged)
            setAppointmentHasUpdate(true)
        }

        if (deleted) {

            setDeletedId(deleted as string)
            let dataDeleted = appoitmenttSchedule?.filter(appointment => appointment.id !== deleted)
            setAppointmentSchedule(dataDeleted)
            setAppointmentHasDeleted(true)

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

    useEffect(() => {
        if (appointmentHasDeleted) {
            deleteAppointment(deletedId!)
            setAppointmentHasDeleted(false)
        }
    }, [appointmentHasDeleted, appoitmenttSchedule, deletedId])

    interface BasicLayoutProps {
        readOnly?: boolean
        appointmentData: AppointmentSchedule
        appointmentResources: Array<any>
        onFieldChange: (nextFieldValue: { [fieldName: string]: any }) => void
    }

    const TextEditor = (props: AppointmentForm.TextEditorProps) => {
        if (props.type === 'multilineTextEditor') {
            return null;
        }
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
                console.log("Data selecionada:", value);
            } else {
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
            <>
                <AppointmentForm.BasicLayout
                    appointmentData={appointmentData}
                    onFieldChange={onFieldChange}
                    booleanEditorComponent={BooleanEditor}
                    labelComponent={LabelComponent}
                    dateEditorComponent={DateEditorComponent}
                    {...restProps}
                />
            </>
        );
    }

    const resources = [{
        fieldName: 'type',
        title: 'Type',
        instances: [
            { id: 'appointment', text: 'Consulta', color: '#0095A1' },
            { id: 'recurring_session', text: 'Sessão Recorrente', color: '#F42272' },
        ],
    }];

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
                        startDayHour={6}
                        endDayHour={19}
                        timeTableCellComponent={TimeTableCell}
                        dayScaleCellComponent={DayScaleCell}
                    />
                    <Toolbar />
                    <DateNavigator />
                    <TodayButton />
                    <Appointments />
                    <Resources
                        data={resources}
                    />
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                    />
                    <AppointmentForm
                        basicLayoutComponent={BasicLayout}
                        textEditorComponent={TextEditor}
                    />
                </Scheduler>
            </Paper>
        </Stack>

    );
}

export default Schedule;