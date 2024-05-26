'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Card, CardHeader, Divider, TextField } from '@mui/material';

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

const not = (a: readonly string[], b: readonly string[]) => {
    return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a: readonly string[], b: readonly string[]) => {
    return a.filter((value) => b.indexOf(value) !== -1);
};

const union = (a: readonly string[], b: readonly string[]) => {
    return [...a, ...not(b, a)];
};

const Groups = () => {
    const [groupName, setGroupName] = useState<string>('');
    const [checked, setChecked] = useState<readonly string[]>([]);
    const [maxChecked, setMaxChecked] = useState<number>(6); // Maximum number of patients in the group
    const [left, setLeft] = useState<readonly string[]>([]);
    const [right, setRight] = useState<readonly string[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        const fetchPatients = async () => {
            const patientsData = await getPatients();
            setPatients(patientsData);
            setLeft(patientsData.map((patient) => patient.id)); // Populate the left list with patient IDs
        };
        fetchPatients();
    }, []);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: readonly string[]) =>
        intersection(checked, items).length;

    const handleToggleAll = (items: readonly string[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        if (right.length + leftChecked.length <= maxChecked) {
            setRight(right.concat(leftChecked));
            setLeft(not(left, leftChecked));
            setChecked(not(checked, leftChecked));
        } else {
            alert(`You can only add up to ${maxChecked} patients to the group.`);
        }
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleGroupNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setGroupName(event.target.value);
    };

    async function handleSave() {
        if (groupName && right.length > 0) {
            try {
                const response = await fetch('/api/classes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: groupName,
                        patientIds: right,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                alert('Group saved successfully!');
                // Optionally, reset the state after saving
                setGroupName('');
                setRight([]);
            } catch (error) {
                console.error('Failed to save group:', error);
                alert('Failed to save group');
            }
        }
    };

    const customList = (title: React.ReactNode, items: readonly string[]) => (
        <Card>
            <CardHeader
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selecionados`}
            />
            <Divider />
            <List
                sx={{
                    width: '35vw',
                    height: '60vh',
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: string) => {
                    const labelId = `transfer-list-all-item-${value}-label`;
                    const patient = patients.find((p) => p.id === value);

                    return (
                        <ListItemButton
                            key={value}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={patient ? patient.name : 'Unknown'} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" width='80vw'>
            <Grid item md={10} lg={10} xl={10}>
                <TextField
                    fullWidth
                    id="group-name"
                    label="Nome do Grupo"
                    variant="outlined"
                    value={groupName}
                    onChange={handleGroupNameChange}
                />
            </Grid>
            <Grid item md={2} lg={2} xl={2}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSave}
                    disabled={!groupName || right.length === 0}
                >
                    Salvar
                </Button>
            </Grid>
            <Grid item>{customList('Pacientes', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Grupo', right)}</Grid>
        </Grid>
    );
}

export default Groups;
