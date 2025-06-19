import { serverClient } from "@/lib/server/serverClient";
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: NextRequest) {
    const { query, variables } = await request.json();
    try {
        let result;
        if (query.trim().startsWith('mutation')) {
            // handle mutation
            result = await serverClient.mutate({
                mutation: gql`${query}`,
                variables
            })
        } else {
            // handle queries
            result = await serverClient.query({
                query: gql`${query}`,
                variables
            })
        }

        const data = result.data;
        console.log('Data >>>>', data);

        return NextResponse.json(
            {
                data,
            },
            {
                headers: corsHeaders
            }
        )
        
    } catch(error) {
        console.error('Error >>>>', error);
        return NextResponse.json(error, {
            status: 500,
        })
    }
}