'use client';

import styles from '@/app/ui/list.module.css';
import Paper from '@mui/material/Paper';
import { Grid, PagingPanel, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import { Box } from "@mui/material";
import { useEffect, useState } from 'react';

const ListPatients = () => {

    const [patients, setPatients] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const columns = [
        { name: 'name', title: 'Nome' },
        { name: 'sex', title: 'Sexo' },
        { name: 'job', title: 'Profissão' },
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch(`/api/patient?page=${currentPage}&pageSize=${pageSize}`);
            const data = await res.json();
            setPatients(data.patients);
            setTotalCount(data.totalCount);
        };

        fetchPatients();
    }, [currentPage, pageSize]);

    return (
        <Box className={styles.table} sx={{ display: 'flex', width: '90vw', alignItems: 'center', overflowY: "scroll", overflow: "hidden", justifyContent: 'center' }}>
            <Paper>
                <Grid
                    rows={patients}
                    columns={columns}
                >
                    <PagingState
                        // currentPage={currentPage}
                        // defaultCurrentPage={currentPage}
                        // onCurrentPageChange={setCurrentPage}
                        // pageSize={pageSize}
                        // onPageSizeChange={setPageSize}

                        defaultCurrentPage={0}
                        pageSize={8}
                    />
                    <IntegratedPaging />
                    <Table />
                    <TableHeaderRow />
                    <PagingPanel
                    // pageSizes={[5, 10, 15]}
                    />
                </Grid>
            </Paper>
        </Box>
    );
}

export default ListPatients;