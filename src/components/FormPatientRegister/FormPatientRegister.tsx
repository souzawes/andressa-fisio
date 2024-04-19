"use client"

import React, { ChangeEvent, useState } from 'react';
import { Box, Button, MenuItem, Grid, TextField, InputLabel, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



const FormPatientRegister = () => {

    const [cpf, setCPF] = useState('');
    const [gender, setGender] = React.useState('');
    const [civilState, setCivilState] = React.useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [houseNumber, setHouseNumber] = useState('');

    const handleChangeGender = (event: SelectChangeEvent) => {
        setGender(event.target.value as string);
    };

    const handleChangeCivilState = (event: SelectChangeEvent) => {
        setCivilState(event.target.value as string);
    };

    const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
        const inputCPF = e.target.value;
        const formattedCPF = formatCPF(inputCPF);
        setCPF(formattedCPF);
    };

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const truncated: string = cleaned.slice(0, 11);
        const formatted: string = truncated.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        return formatted;
    };

    const handleHouseNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const inputHouseNumber = e.target.value;
        const formattedHouseNumber = formatHouseNumber(inputHouseNumber);
        setHouseNumber(formattedHouseNumber)
    }

    const formatHouseNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned
    }

    return (
        <Box display='flex' flexDirection='column' alignContent='center' alignItems='center' width='100%'>
            <Grid container width="80vw" height="80%" alignItems="center" alignContent='center' justifyContent='center' display='flex' spacing={3}>
                <Grid item md={8} lg={8} xl={8} >
                    <TextField fullWidth id="full-name" label="Nome completo" variant="outlined" />
                </Grid>
                <Grid item md={4} lg={4} xl={4} >
                    <TextField fullWidth id="cpf" label="CPF" variant="outlined" value={cpf} onChange={handleChangeCpf} />
                </Grid>
                <Grid item md={6} lg={6} xl={6} >
                    <TextField fullWidth id="address" label="Endereço" variant="outlined" />
                </Grid>
                <Grid item md={3} lg={3} xl={3} >
                    <TextField fullWidth id="neighborhood" label="Bairro" variant="outlined" />
                </Grid>
                <Grid item md={3} lg={3} xl={3} >
                    <TextField fullWidth id="house-number" label="Numero" variant="outlined" value={houseNumber} onChange={handleHouseNumber} />
                </Grid>
                <Grid item md={3} lg={3} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DatePicker
                            label="Data de nascimento"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                    </LocalizationProvider>
                </Grid>
                <Grid item md={4} lg={4} xl={4}>
                    <FormControl fullWidth>
                        <InputLabel id="gender">Sexo</InputLabel>
                        <Select
                            labelId="gender"
                            id="demo-simple-select"
                            value={gender}
                            label="Gender"
                            onChange={handleChangeGender}
                        >
                            <MenuItem value={10}>Masulino</MenuItem>
                            <MenuItem value={20}>Feminino</MenuItem>
                            <MenuItem value={30}>Intersexo</MenuItem>
                            <MenuItem value={40}>Outro</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={5} lg={5} xl={5}>
                    <FormControl fullWidth>
                        <InputLabel id="civil-state">Estado Civil</InputLabel>
                        <Select
                            labelId="civil-state"
                            id="demo-simple-select"
                            value={civilState}
                            label="Estado civil"
                            onChange={handleChangeCivilState}
                        >
                            <MenuItem value={10}>Solteiro(a)</MenuItem>
                            <MenuItem value={20}>Casado(a)</MenuItem>
                            <MenuItem value={30}>União Estável</MenuItem>
                            <MenuItem value={40}>Divorciado(a)</MenuItem>
                            <MenuItem value={50}>Viúvo(a)</MenuItem>
                            <MenuItem value={60}>Separado(a)</MenuItem>
                            <MenuItem value={70}>Outro</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={8} lg={8} xl={8} >
                    <TextField fullWidth id="job" label="Profissão" variant="outlined" />
                </Grid>
                <Grid item md={4} lg={4} xl={4} >
                    <TextField fullWidth id="phone" label="Telefone" variant="outlined" />
                </Grid>
            </Grid>

            <Box display='flex' width='100%' justifyContent='space-evenly' alignItems='center' justifyItems='bet' sx={{ paddingTop: 10 }}>
                <Button
                    variant='contained'
                    size='large'
                    sx={{
                        backgroundColor: 'green',
                        color: 'whitesmoke'
                    }}
                >
                    Cadastrar
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    sx={{
                        backgroundColor: 'red',
                        color: 'whitesmoke'
                    }}
                >
                    Cancelar
                </Button>
            </Box>

        </Box>



    );
}

export default FormPatientRegister;