import { NextRequest, NextResponse } from "next/server";


import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const recurring_session = await prisma.recurring_sessions.findMany();
        return NextResponse.json({ message: 'OK', recurring_session })
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Error',
                error
            },
            {
                status: 500
            }
        )
    }
}

export async function POST(req: NextRequest) {
    const {
        class_id,
        start_date,
        end_date,
        start_time,
        end_time,
        recurrence_pattern,
        recurrence_interval,
        ocuurence_days_of_week,
        rrule } = await req.json()

    try {
        const recurring_session = await prisma.recurring_sessions.create({
            data: {
                class_id,
                start_date,
                end_date,
                start_time,
                end_time,
                recurrence_pattern,
                recurrence_interval,
                ocuurence_days_of_week,
                rrule
            }
        })
        return NextResponse.json({ message: "OK", recurring_session })

    } catch (err: any) {
        console.error('Error', err)
        return NextResponse.json(
            {
                message: 'Error',
                error: err.message || 'Erro desconhecido',
            },
            {
                status: 500,
            }
        )
    }
}