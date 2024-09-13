import { NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { NextApiResponse } from 'next';
import { log } from 'console';
// Remove the import statement for 'V4Options' from the 'uuid' module

/*
export async function POST(req: Request) {
    const {
        name,
        // patientIds,
    } = await req.json()

    try {
        const newClass = await prisma.classes.create({
            data: {
                id: uuidv4(),
                name: name,
                creation_date: new Date(),
                // patients_classes: {
                //     create: patientIds?.map((patientId: any) => ({
                //         patient_id: patientId,
                //     }))
                // },
            },
        },
        );
        return Response.json({ message: 'OK', newClass });
    } catch (err: any) {
        return NextResponse.json(
            {
                message: 'Error',
                error: err.message || 'Erro desconhecido',
            },
            {
                status: 500,
            }
        );
    }

    //     return res.status(200).json({ message: 'Class created successfully.', newClass });
    // } catch (error) {
    //     console.error('Failed to create class:', error);
    //     return res.status(500).json({ message: 'Failed to create class', error });
    // }
}
*/

export async function POST(req: Request) {
    const {
        name,
        patientIds,
    } = await req.json();

    // Validação básica dos dados recebidos
    if (!name || !Array.isArray(patientIds) || patientIds.length === 0) {
        return NextResponse.json({ message: 'name e patientIds são obrigatórios e patientIds deve ser um array não vazio' }, { status: 400 });
    }

    // Validação de UUIDs
    if (!patientIds.every((id: string) => isUuid(id))) {
        return NextResponse.json({ message: 'Todos os patientIds devem ser UUIDs válidos' }, { status: 400 });
    }

    try {
        const result = await prisma.$transaction(async (prisma) => {
            // Create a new class
            const newClass = await prisma.classes.create({
                data: {
                    id: uuidv4(),
                    name: name,
                    creation_date: new Date(),
                }
            });

            // Preparação dos dados para a tabela de junção
            const dataPatientsClasses = patientIds.map((patientId: string) => ({
                patient_id: patientId,
                class_id: newClass.id,
            }));

            console.log('dataPatientsClasses', dataPatientsClasses)

            // Inserção dos registros na tabela de junção
            await prisma.patients_classes.createMany({
                data: dataPatientsClasses,
            });
            return { newClass, dataPatientsClasses };
        });
        return NextResponse.json({ message: 'OK', result });

    } catch (err: any) {
        console.error('Erro na transação:', err);
        return NextResponse.json(
            {
                message: 'Error',
                error: err.message || 'Erro desconhecido',
            },
            {
                status: 500,
            }
        );
    }

}
