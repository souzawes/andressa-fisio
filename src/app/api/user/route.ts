import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";

import prisma from "@/lib/db"

var bcrypt = require('bcrypt')

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.users.findMany();
        return Response.json({ message: "OK", users })
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

export async function POST(req: Request) {
    const { name, email, password } = await req.json()
    try {
        const bcryptPassword = await bcrypt.hash(password, 10);
        console.log(password);

        const user = await prisma.users.create({
            data: {
                id: uuidv4(),
                name,
                email,
                password: bcryptPassword
            }
        })
        return Response.json({ message: "OK", user })
    } catch (err) {
        return NextResponse.json(
            {
                message: `${err}`,
                err
            },
            {
                status: 500
            }
        )
    }
}