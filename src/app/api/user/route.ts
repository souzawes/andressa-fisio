import { NextRequest, NextResponse } from "next/server"

import prisma from "../../../../lib/db"

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.users.findMany();
        return Response.json({message: "OK", users})
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
    const {id, name, email, password} = await req.json()
    try {
        const user = await prisma.users.create({
            data: {
                id,
                name,
                email,
                password
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