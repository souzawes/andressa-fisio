'use client';

import styles from '@/app/ui/list.module.css';

import { Box } from "@mui/material";

// import {
//     MaterialReactTable,
//     useMaterialReactTable,
//     type MRT_ColumnDef, //if using TypeScript (optional, but recommended)
// } from 'material-react-table';

//Import Material React Table Translations
// import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';


const ListPatients = () => {
    //If using TypeScript, define the shape of your data (optional, but recommended)
    interface Patient {
        name: string;
        age: number;
        gender: 'Masculino' | 'Feminino' | 'Intersexo' | 'Outro'
        group: 'Pilates' | 'RPG' | 'Fisioterapia' | 'Nenhum';
    }

    //mock data - strongly typed if you are using TypeScript (optional, but recommended)
    const data: Patient[] = [
        {
            name: 'John Doe',
            age: 30,
            gender: 'Masculino',
            group: 'Pilates'
        },
        {
            name: 'Sara Smith',
            age: 25,
            gender: 'Feminino',
            group: 'RPG'
        },
        {
            name: 'Michael Johnson',
            age: 40,
            gender: 'Masculino',
            group: 'Fisioterapia'
        },
        {
            name: 'Emily Davis',
            age: 35,
            gender: 'Feminino',
            group: 'Pilates'
        },
        {
            name: 'David Brown',
            age: 45,
            gender: 'Masculino',
            group: 'RPG'
        },
        {
            name: 'Jessica Garcia',
            age: 28,
            gender: 'Feminino',
            group: 'Fisioterapia'
        },
        {
            name: 'Daniel Wilson',
            age: 33,
            gender: 'Masculino',
            group: 'Pilates'
        },
        {
            name: 'Sophia Martinez',
            age: 32,
            gender: 'Feminino',
            group: 'RPG'
        },
        {
            name: 'Matthew Taylor',
            age: 27,
            gender: 'Masculino',
            group: 'Fisioterapia'
        },
        {
            name: 'Olivia Anderson',
            age: 38,
            gender: 'Feminino',
            group: 'Pilates'
        },
        {
            name: 'William Hernandez',
            age: 31,
            gender: 'Masculino',
            group: 'RPG'
        },
        {
            name: 'Isabella Lopez',
            age: 29,
            gender: 'Feminino',
            group: 'Fisioterapia'
        },
        {
            name: 'Ethan Gonzalez',
            age: 34,
            gender: 'Masculino',
            group: 'Pilates'
        },
        {
            name: 'Ava Wilson',
            age: 42,
            gender: 'Feminino',
            group: 'RPG'
        },
        {
            name: 'Alexander Perez',
            age: 26,
            gender: 'Masculino',
            group: 'Fisioterapia'
        },
        {
            name: 'Mia Turner',
            age: 39,
            gender: 'Feminino',
            group: 'Pilates'
        },
        {
            name: 'James Martin',
            age: 37,
            gender: 'Masculino',
            group: 'RPG'
        },
        {
            name: 'Charlotte Hall',
            age: 36,
            gender: 'Feminino',
            group: 'Fisioterapia'
        },
        {
            name: 'Benjamin Young',
            age: 41,
            gender: 'Masculino',
            group: 'Pilates'
        },
        {
            name: 'Amelia White',
            age: 24,
            gender: 'Feminino',
            group: 'RPG'
        }
    ];

    function App() {
        //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
        // const columns = useMemo<MRT_ColumnDef<Patient>[]>(
        //     () => [
        //         {
        //             accessorKey: 'name', //simple recommended way to define a column
        //             header: 'Nome',

        //             // muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        //             enableHiding: false, //disable a feature for this column
        //         },
        //         {
        //             accessorKey: 'age', //simple recommended way to define a column
        //             header: 'Idade',

        //             // muiTableHeadCellProps: { style: { color: 'blue' } }, //custom props
        //             enableHiding: false, //disable a feature for this column
        //         },
        //         {
        //             accessorKey: 'gender', //simple recommended way to define a column
        //             header: 'Genero',
        //             // muiTableHeadCellProps: { style: { color: 'blue' } }, //custom props
        //             enableHiding: false, //disable a feature for this column
        //         },
        //         {
        //             accessorKey: 'group', //simple recommended way to define a column
        //             header: 'Grupo',
        //             Cell: ({ cell }) => (
        //                 <Chip label={cell.getValue<string>()} color="primary" variant="outlined" />
        //             ),
        //             // muiTableHeadCellProps: { style: { color: 'green' } }, //custom props
        //             enableHiding: false, //disable a feature for this column
        //         },
        //     ],
        //     [],
        // );

        //pass table options to useMaterialReactTable
        // const table = useMaterialReactTable({
        //     columns,
        //     data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        //     enableRowSelection: false, //enable some features
        //     enableColumnOrdering: true, //enable a feature for all columns
        //     enableGlobalFilter: false, //turn off a feature
        //     enableColumnActions: false,
        //     enableTopToolbar: false,
        //     enableBottomToolbar: true,
        //     enableColumnDragging: false,
        //     enableGlobalFilterModes: true,
        //     enableSelectAll: false,
        //     localization: MRT_Localization_PT_BR,
        //     muiTableContainerProps: {
        //         sx: { maxHeight: '80vh', minWidth: '100%' },



        //     }
        // });

        //note: you can also pass table options as props directly to <MaterialReactTable /> instead of using useMaterialReactTable
        //but the useMaterialReactTable hook will be the most recommended way to define table options
        // return <MaterialReactTable table={table} />;
        return (
            <></>
        );
    }


    return (
        <Box className={styles.table} sx={{ display: 'flex', width: '80vw', alignItems: 'center', overflowY: "scroll", overflow: "hidden", justifyContent: 'center' }}>
            <App></App>
        </Box>
    );
}

export default ListPatients;