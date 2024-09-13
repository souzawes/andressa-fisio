import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const classe = await prisma.classes.findUnique({
            where: { id }
        });

        if (!classe) {
            return NextResponse.json(
                {
                    message: "Classe not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json({ message: "OK", classe });
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
