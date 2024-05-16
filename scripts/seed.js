
const { db } = require('@vercel/postgres');

const {
    users,
    patients,
    classes,
    appointments
} = require('../lib/placeholder-data.js');
const bcrypt = require('bcrypt');
const { error } = require('console');


let nextPatientIndex = 0;

function getNextPatientId() {
    const patient = patients[nextPatientIndex];
    nextPatientIndex = (nextPatientIndex + 1) % patients.length; // Incrementa o índice e garante que ele volte ao início quando atingir o final
    return patient.id;
}

async function createUsersTable(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        // Create the "users" table if it doesn't exist
        const createTable = await client.sql`
          CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          );
        `;

        console.log(`Created "users" table`);

        return {
            createTable
        };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

async function populateUsersTable(client) {
    try {
        // Inserir dados na tabela "users"
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return client.sql`
                    INSERT INTO users (id, name, email, password)
                    VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
                    ON CONFLICT (id) DO NOTHING;
                `;
            }),
        );

        console.log(`Seeded ${insertedUsers.length} users`);
    } catch (error) {
        console.error('Error populating users table:', error);
        throw error;
    }
}

async function createPatientsTable(client) {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                cpf VARCHAR(14) UNIQUE,
                address VARCHAR(255),
                neighborhood VARCHAR(255),
                number_house VARCHAR(10),
                date_of_birth DATE NOT NULL,
                sex VARCHAR(10),
                civil_state VARCHAR(20),
                job VARCHAR(255)
            );
        `);

        console.log(`Created "patients" table`);
    } catch (error) {
        console.error('Error creating patient table:', error);
        throw error;
    }
};

async function populatePatientTable(client) {
    try {
        const insertedPatients = await Promise.all(
            patients.map(async (patient) => {
                return client.query(`
                INSERT INTO patients (id, name, cpf, address, neighborhood, number_house, date_of_birth, sex, civil_state, job)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id) DO NOTHING;
            `, [
                    patient.id,
                    patient.name,
                    patient.cpf,
                    patient.address,
                    patient.neighborhood,
                    patient.number_house,
                    patient.date_of_birth,
                    patient.sex,
                    patient.civil_state,
                    patient.job
                ]);
            })
        )

        console.log(`Seeded ${insertedPatients.length} patients`);
    } catch (error) {
        console.error('Error populating patient table:', error);
        throw error;
    }
};

async function createClassesTable(client) {
    try {
        // Criar a tabela "classes" se ela não existir
        await client.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                creation_date DATE
            );
        `);

        console.log(`Created "classes" table`);
    } catch (error) {
        console.error('Error creating classes table:', error);
        throw error;
    }
};

async function populateClassesTable(client) {
    try {
        // Inserir dados na tabela "classes"
        const insertedClasses = await Promise.all(
            classes.map(async (classData) => {
                return client.query(`
                    INSERT INTO classes (id, name, creation_date)
                    VALUES ($1, $2, NOW())
                    ON CONFLICT (id) DO NOTHING; 
                `, [classData.id, classData.name]);
            })
        );

        console.log(`Seeded ${insertedClasses.length} classes`);
    } catch (error) {
        console.error('Error populating classes table:', error);
        throw error;
    }
};

async function createPatientsClassesTable(client) {
    try {
        // Criar a tabela "patients_classes" se ela não existir
        await client.query(`
            CREATE TABLE IF NOT EXISTS patients_classes (
                patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
                class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
                PRIMARY KEY (patient_id, class_id)
            );
        `);

        console.log(`Created "patients_classes" table`);
    } catch (error) {
        console.error('Error creating patients_classes table:', error);
        throw error;
    }
};

async function populatePatientsClassesTable(client) {
    // Associações entre pacientes e turmas
    const associations = [
        // Associando pacientes com turmas
        // 2 pacientes na primeira turma
        { patientId: patients[0].id, classId: classes[0].id },
        { patientId: patients[1].id, classId: classes[0].id },
        // 4 pacientes na segunda turma
        { patientId: patients[2].id, classId: classes[1].id },
        { patientId: patients[3].id, classId: classes[1].id },
        { patientId: patients[4].id, classId: classes[1].id },
        { patientId: patients[5].id, classId: classes[1].id },
        // 3 pacientes na terceira turma
        { patientId: patients[6].id, classId: classes[2].id },
        { patientId: patients[7].id, classId: classes[2].id },
        { patientId: patients[8].id, classId: classes[2].id }
    ];

    try {
        // Inserir associações
        const insertAssociations = await Promise.all(
            associations.map(async (association) => {
                return client.query(`
                    INSERT INTO patients_classes (patient_id, class_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING; 
                `, [association.patientId, association.classId]);
            })
        );

        console.log(`Seeded patients_classes ${insertAssociations.length} associations`);
    } catch (error) {
        console.error('Error populating patients_classes table:', error);
        throw error;
    }
};

async function createAppointmentsTable(client) {
    try {
        // Create the "appointments" table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
                type VARCHAR(255),
                date DATE,
                start_time TIME,
                end_time TIME
            );
        `);

        console.log(`Created "appointments" table`);
    } catch (error) {
        console.error('Error creating appointments table:', error);
        throw error;
    }
};

async function createAppointmentTimeConflictTrigger(client) {
    try {
        // Create the trigger to enforce time constraint
        await client.query(`
            CREATE OR REPLACE FUNCTION check_appointment_time_conflict() RETURNS TRIGGER AS $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM appointments
                    WHERE date = NEW.date                    
                    AND(
                        (NEW.start_time = start_time AND NEW.end_time = end_time) -- same time exactly
                        OR (NEW.start_time > start_time AND NEW.start_time < end_time) -- starts during appointment registered
                        OR (NEW.end_time > start_time AND NEW.end_time < end_time) -- ends during appointment registered
                        OR (NEW.start_time < start_time AND NEW.end_time > end_time) -- includes appointment registered
                        OR (NEW.start_time > start_time AND NEW.end_time < end_time) -- is encompassed for appointment registered
                    )

                ) THEN
                    RAISE EXCEPTION 'Another appointment already exists at this time.';
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE OR REPLACE TRIGGER appointment_time_conflict_trigger
            BEFORE INSERT ON appointments
            FOR EACH ROW
            EXECUTE FUNCTION check_appointment_time_conflict();
        `);

        console.log(`Created appointment_time_conflict_trigger`);
    } catch (error) {
        console.error('Error creating appointment time conflict trigger:', error);
        throw error;
    }
};

async function createRecurringSessionsTable(client) {
    try {
        // Create the "recurring_sessions" table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS recurring_sessions (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
                start_date DATE,
                end_date DATE,
                start_time TIME,
                end_time TIME,
                recurrence_pattern VARCHAR(255),
                recurrence_interval INTEGER,
                ocuurence_days_of_week VARCHAR(255),
                rrule VARCHAR(255)
            );
        `);

        console.log(`Created "recurring_sessions" table`);
    } catch (error) {
        console.error('Error creating recurring_sessions table:', error);
        throw error;
    }
};

async function createRecurringSessionTimeClonflictTigger(client) {
    try {
        // Create the trigger to enforce time constraint
        await client.query(`
            CREATE OR REPLACE FUNCTION check_recurring_session_time_conflict() RETURNS TRIGGER AS $$
            DECLARE
                current_date DATE := NEW.date;
                current_time TIME := NEW.start_time;
                day_of_week_array INTEGER[];
                day_of_week INTEGER;
            BEGIN
                -- Parse the comma-separated occurrence days of week into an array
                day_of_week_array := string_to_array(NEW.occurrence_days_of_week, ',', 'NULL');

                -- Iterate over each day of the week in the array
                FOREACH day_of_week IN ARRAY day_of_week_array

                LOOP

                    -- Check for conflicts for each occurrence day of week
                    IF EXISTS (
                        SELECT 1
                        FROM recurring_sessions
                        day_of_week_array := string_to_array(occurrence_days_of_week, ',', 'NULL');
                        WHERE
                            current_date BETWEEN start_date AND end_date
                            AND current_day_of_week = day_of_week
                            AND (
                                (current_time >= start_time AND current_time < end_time)
                                OR (NEW.end_time > start_time AND NEW.end_time <= end_time)
                                OR (NEW.start_time <= start_time AND NEW.end_time >= end_time)
                            )
                    ) THEN
                        RAISE EXCEPTION 'Another recurring session conflicts with the appointment time.';
                    END IF;

                    -- Increment current date to the next occurrence day of week
                    current_date := current_date + INTERVAL '1' WEEK;
                    current_day_of_week := (current_day_of_week + 1) % 7;
                
                END LOOP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        console.log(`Created recurring_session_time_conflict_trigger`);
    } catch (error) {
        console.error('Error creating recurring session time conflict trigger:', error);
        throw error;
    }
}

// async function populateAppointmentsTable(client) {
//     try {
//         // Insert appointments into the "appointments" table
//         await Promise.all(
//             appointments.map(async (data) => {
//                 // Calculate end time (1 hour after start time)
//                 const end_time = new Date(`2000-01-01T${data.start_time}`);
//                 end_time.setHours(end_time.getHours() + 1);
//                 const formattedEndTime = end_time.toTimeString().slice(0, 8);

//                 // Get the next patient id from the sequential list
//                 const patientId = getNextPatientId();

//                 // Insert the appointment
//                 await client.query(`
//                     INSERT INTO appointments (patient_id, type, date, start_time, end_time)
//                     VALUES ($1, $2, $3, $4, $5)
//                     ON CONFLICT DO NOTHING;
//                 `, [patientId, data.type, data.date, data.start_time, formattedEndTime]);
//             })
//         );

//         console.log(`Seeded appointments`);
//     } catch (error) {
//         console.error('Error populating appointments table:', error);
//         throw error;
//     }
// };



async function main() {
    const client = await db.connect();

    // Create database tables
    // await createUsersTable(client);
    // await createPatientsTable(client);
    // await createClassesTable(client);
    // await createPatientsClassesTable(client);
    // await createAppointmentsTable(client);
    // await createRecurringSessionsTable(client);

    // Create Tiggers
    // await createAppointmentTimeConflictTrigger(client);
    // await createRecurringSessionTimeClonflictTigger(client);

    // Populate tables with fake datas
    await populateUsersTable(client);
    await populatePatientTable(client);
    await populateClassesTable(client);
    // await populatePatientsClassesTable(client);
    await populateAppointmentsTable(classes);

    // await seedUsers(client);
    // await seedPatients(client);
    // await seedClasses(client);
    // await seedPatientsClasses(client);
    // await seedAppointments(client);

    await client.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});