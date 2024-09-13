import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

interface PatientsClasses {
    patient_id: string;
    class_id: string;
}

export async function POST(req: Request, res: NextApiResponse) {

    const { patients_id, class_id } = await req.json();

    const dataPatientsClasses: PatientsClasses[] = patients_id.map((patient_id: string) => ({
        patient_id,
        class_id,
    }));

    try {
        const newPatientClass = await prisma.patients_classes.createMany({
            data: dataPatientsClasses,
            // skipDuplicates: true, // Opcional: ignora registros duplicados
        });

        return Response.json({ message: 'OK', newPatientClass });
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

}
