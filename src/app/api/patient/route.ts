import { NextRequest, NextResponse } from "next/server"

import prisma from "../../../../lib/db"
import { v4 as uuidv4 } from 'uuid';

// export async function GET(req: NextRequest) {
//     try {
//         const patients = await prisma.patients.findMany();
//         return Response.json({message: "OK", patients})
//     } catch (err) {
//         return NextResponse.json(
//             {
//                 message: "Error",
//                 err
//             },
//             {
//                 status: 500
//             }
//         )
//     }    
// }


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');

    if (page !== null && pageSize !== null) {
        // Paginated request
        const pageNum = parseInt(page, 10);
        const size = parseInt(pageSize, 10);

        try {
            const totalPatients = await prisma.patients.count();
            const patients = await prisma.patients.findMany({
                skip: pageNum * size,
                take: size,
                select: {
                    name: true,
                    sex: true,
                    job: true,
                }
            });
            return NextResponse.json({ message: "OK", patients, totalCount: totalPatients });
        } catch (err) {
            return NextResponse.json(
                {
                    message: "Error",
                    err
                },
                {
                    status: 500
                }
            )
        }
    } else {
        // Default request
        try {
            const patients = await prisma.patients.findMany();
            return Response.json({ message: "OK", patients })
        } catch (err) {
            return NextResponse.json(
                {
                    message: "Error",
                    err
                },
                {
                    status: 500
                }
            )
        }
    }
}

export async function POST(req: Request) {
    const {
        name,
        cpf,
        address,
        neighborhood,
        number_house,
        date_of_birth,
        sex,
        civil_state,
        job
    } = await req.json()

    // Verificar e converter a data de nascimento se necessário
    const dateOfBirth = new Date(date_of_birth);

    try {
        const patients = await prisma.patients.create({
            data: {
                id: uuidv4(),
                name,
                cpf,
                address,
                neighborhood,
                number_house,
                date_of_birth: dateOfBirth,
                sex,
                civil_state,
                job
            }
        })
        return Response.json({ message: "OK", patients })
    } catch (err: any) {
        return NextResponse.json(
            {
                message: "Error",
                error: err.message || "Erro desconhecido"
            },
            {
                status: 500
            }
        )
    }
}