"use client"

import React, { ChangeEvent, use, useEffect, useState } from 'react';
import { Box, Button, MenuItem, Grid, TextField, InputLabel, FormControl, Menu, Snackbar, Alert } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

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

enum genderList {
    Masculino = 'Masculino',
    Feminino = 'Feminino',
    Intersexo = 'Intersexo',
    Outro = 'Outro'
};

enum civilStateList {
    Solteiro = 'Solteiro',
    Casado = 'Casado',
    UniaoEstavel = 'União Estável',
    Divorciado = 'Divorciado',
    Viuvo = 'Viúvo',
    Separado = 'Separado',
    Outro = 'Outro'
};

async function postPatient(patientData: any) {
    try {
        const response = await fetch('/api/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            return result;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao cadastrar paciente');
        }
    } catch (error) {
        console.error('Erro ao cadastrar paciente', error);
        throw error;
    }


}

const FormPatientRegister: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [cpf, setCPF] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [neighborhood, setNeighborhood] = useState<string>('');
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [dataOfBirth, setDataOfBirth] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [civilState, setCivilState] = useState<string>('');
    const [job, setJob] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const allFilled = name && cpf && address && neighborhood && houseNumber && dataOfBirth && gender && civilState && job && phone;
        setAllFieldsFilled(!!allFilled);
    }, [name, cpf, address, neighborhood, houseNumber, dataOfBirth, gender, civilState, job, phone]);


    const handlerName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value as string);
    };

    const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
        const inputCPF = e.target.value;
        const formattedCPF = formatCPF(inputCPF);
        setCPF(formattedCPF);
    };

    const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
        const inputAddress = e.target.value;
        setAddress(inputAddress);
    };

    const handleNeighborhood = (e: ChangeEvent<HTMLInputElement>) => {
        const inputNeighborhood = e.target.value;
        setNeighborhood(inputNeighborhood);
    };

    const handleHouseNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const inputHouseNumber = e.target.value;
        const formattedHouseNumber = formatHouseNumber(inputHouseNumber);
        setHouseNumber(formattedHouseNumber)
    };

    const handleDataOfBirth = (date: Dayjs | null) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setDataOfBirth(formattedDate);
        }
    };

    const handleChangeGender = (event: SelectChangeEvent) => {
        setGender(event.target.value as string);
    };

    const handleChangeCivilState = (event: SelectChangeEvent) => {
        setCivilState(event.target.value as string);
    };

    const handlerJob = (event: ChangeEvent<HTMLInputElement>) => {
        setJob(event.target.value as string);
    };

    const handlerPhone = (event: ChangeEvent<HTMLInputElement>) => {
        const inputPhone = event.target.value;
        const formattedPhone = formatPhone(inputPhone);
        setPhone(formattedPhone);
    };

    function clearAllFieldsRegisterForm() {
        setName('');
        setCPF('');
        setAddress('');
        setNeighborhood('');
        setHouseNumber('');
        setDataOfBirth('');
        setGender('');
        setCivilState('');
        setJob('');
        setPhone('');

        setAllFieldsFilled(false);
    };

    const handleRegisterPatient = async () => {
        const patientData = {
            name,
            cpf,
            address,
            neighborhood,
            number_house: houseNumber,
            date_of_birth: dataOfBirth,
            sex: gender,
            civil_state: civilState,
            job,
            phone
        };

        try {
            const response = await postPatient(patientData);
            console.log("Paciente registrado com sucesso: ", response.message);
            setSuccessMessage('Paciente registrado com sucesso');
            setErrorMessage(null);
            clearAllFieldsRegisterForm();
        } catch (error) {
            console.error('Erro ao cadastrar paciente', error);
            setErrorMessage('Erro ao cadastrar paciente');
            setSuccessMessage(null);
        }
    };

    /* =================================================================================================
    * Formatfunctions         
    * =================================================================================================
    */

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const truncated: string = cleaned.slice(0, 11);
        const formatted: string = truncated.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        return formatted;
    };


    const formatHouseNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned
    }

    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const truncated: string = cleaned.slice(0, 11);
        const formatted: string = truncated.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        return formatted;
    };

    return (
        <Box display='flex' flexDirection='column' alignContent='center' alignItems='center' width='100%'>
            <Grid container width="80vw" height="80%" alignItems="center" alignContent='center' justifyContent='center' display='flex' spacing={3}>
                <Grid item md={8} lg={8} xl={8} >
                    <TextField
                        fullWidth
                        id="full-name"
                        label="Nome completo"
                        variant="outlined"
                        value={name}
                        onChange={handlerName}
                    />
                </Grid>
                <Grid item md={4} lg={4} xl={4} >
                    <TextField
                        fullWidth
                        id="cpf"
                        label="CPF"
                        variant="outlined"
                        value={cpf}
                        onChange={handleChangeCpf}
                    />
                </Grid>
                <Grid item md={6} lg={6} xl={6} >
                    <TextField
                        fullWidth
                        id="address"
                        label="Endereço"
                        variant="outlined"
                        value={address}
                        onChange={handleAddress}
                    />
                </Grid>
                <Grid item md={3} lg={3} xl={3} >
                    <TextField
                        fullWidth
                        id="neighborhood"
                        label="Bairro"
                        variant="outlined"
                        value={neighborhood}
                        onChange={handleNeighborhood}
                    />
                </Grid>
                <Grid item md={3} lg={3} xl={3} >
                    <TextField fullWidth id="house-number" label="Numero" variant="outlined" value={houseNumber} onChange={handleHouseNumber} />
                </Grid>
                <Grid item md={3} lg={3} xl={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

                        <DatePicker
                            label="Data de nascimento"
                            value={dataOfBirth ? dayjs(dataOfBirth) : null}
                            onChange={handleDataOfBirth}
                            renderInput={(params) => <TextField {...params} fullWidth />}
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
                            <MenuItem value={genderList.Masculino}>Masculino</MenuItem>
                            <MenuItem value={genderList.Feminino}>Feminino</MenuItem>
                            <MenuItem value={genderList.Intersexo}>Intersexo</MenuItem>
                            <MenuItem value={genderList.Outro}>Outro</MenuItem>
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
                            <MenuItem value={civilStateList.Solteiro}>Solteiro(a)</MenuItem>
                            <MenuItem value={civilStateList.Casado}>Casado(a)</MenuItem>
                            <MenuItem value={civilStateList.UniaoEstavel}>União Estável</MenuItem>
                            <MenuItem value={civilStateList.Divorciado}>Divorciado(a)</MenuItem>
                            <MenuItem value={civilStateList.Viuvo}>Viúvo(a)</MenuItem>
                            <MenuItem value={civilStateList.Separado}>Separado(a)</MenuItem>
                            <MenuItem value={civilStateList.Outro}>Outro</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={8} lg={8} xl={8} >
                    <TextField
                        fullWidth
                        id="job"
                        label="Profissão"
                        variant="outlined"
                        value={job}
                        onChange={handlerJob}
                    />
                </Grid>
                <Grid item md={4} lg={4} xl={4} >
                    <TextField
                        fullWidth
                        id="phone"
                        label="Telefone"
                        variant="outlined"
                        value={phone}
                        onChange={handlerPhone}
                    />
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
                    onClick={handleRegisterPatient}
                    disabled={!allFieldsFilled}
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

        </Box>



    );
}

export default FormPatientRegister;