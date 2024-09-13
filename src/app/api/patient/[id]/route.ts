import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const patient = await prisma.patients.findUnique({
            where: { id }
        });

        if (!patient) {
            return NextResponse.json(
                {
                    message: "Patient not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json({ message: "OK", patient });
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
