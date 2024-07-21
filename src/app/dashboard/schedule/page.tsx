"use client"

import Paper from '@mui/material/Paper';
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
import theme from '@/theme/Theme';


import appointments from '@/utils/today-appoitment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import HeaderPages from '@/components/HearderPages/HeaderPages';
import { Stack } from '@mui/material';
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

    const [namePatient, setNamePatient] = useState<string[] | null>(null)

    useEffect(() => {
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
    }, []);

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


    function commitChanges({ added, changed, deleted }: any) {

        if (changed) {
            let dataChanged =
                data.map(appointments => (
                    changed[appointments.id] ? { ...appointments, ...changed[appointments.id] } : appointments
                ))
            setData(dataChanged)
        }

        if (added) {

        }

        if (deleted) {

        }


        // return dataChanged
    };

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


    return (
        <Stack sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <HeaderPages title='Calendário' backButton={true}></HeaderPages>
            <Paper sx={{ mr: 1, ml: 1, borderRadius: '22px', height: '80vh' }}>
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

                    />
                </Scheduler>
            </Paper>
        </Stack>

    );
}

export default Schedule;