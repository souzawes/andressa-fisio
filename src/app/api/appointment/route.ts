import { NextRequest, NextResponse } from "next/server"

import {v4 as uuidv4} from 'uuid';
import prisma from "../../../../lib/db"

export async function GET(req: NextRequest) {
    try {
        const appointments = await prisma.appointments.findMany();
        return Response.json({message: "OK", appointments})
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

export async function POST(req:Request) {
    const {patient_id, type, date, start_time, end_time} = await req.json()
    try {
        const user = await prisma.appointments.create({
            data: {
                id: uuidv4(),
                patient_id,
                type,
                date,
                start_time,
                end_time
            }
        })        
    return Response.json({message: "OK", user})
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

export async function PATCH(req: Request) {
    const { id, date, start_time, end_time } = await req.json()
    try {
        const updateAppointment = await prisma.appointments.update({
            where: {
                id: id,
            },
            data: {
                date, start_time, end_time
            }
        })
        return Response.json({message: "OK", updateAppointment})
    } catch(err) {
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