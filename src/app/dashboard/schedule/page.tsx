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
import React, { useState } from 'react';

const PREFIX = "Demo";

const Schedule = () => {

    const [data, setData] = useState(appointments);
    const [currentDate, setCurrentDate] = useState(Date.now);

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
            return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
        } if (date.getDay() === 0 || date.getDay() === 6) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
        } return <StyledWeekViewTimeTableCell {...props} />;
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
        <Paper sx={{ mr: 1, ml: 1, borderRadius: '22px', height: '80vh' }}>
            <Scheduler
                data={data}
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
    );
}

export default Schedule;