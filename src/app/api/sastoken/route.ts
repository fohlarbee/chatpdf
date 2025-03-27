import { 
    StorageSharedKeyCredential, 
    generateBlobSASQueryParameters, 
    ContainerSASPermissions, 
     } from '@azure/storage-blob';
import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME as string;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.NEXT_PUBLIC_AZURE_STORAGE_KEY as string;
const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME as string;



const generateSASToken = async (fileName: string) => {
    const sharedKeyCredential = new StorageSharedKeyCredential(NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY);

    const expiresOn = new Date(new Date().valueOf() + 60 * 60 * 1000);

    const sasToken = generateBlobSASQueryParameters({
        containerName: AZURE_STORAGE_CONTAINER_NAME,
        blobName: fileName,
        permissions: ContainerSASPermissions.parse("racwd"),
        startsOn: new Date(),
        expiresOn: expiresOn,
    }, sharedKeyCredential).toString();

    return sasToken;
};

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { fileName } = body;
    try {
        const sasToken = await generateSASToken(fileName);
        return NextResponse.json({ sasToken });
    } catch (error) {
        console.error(`Failed to generate SAS token: ${error}`);
        return NextResponse.json({ error: `Failed to generate SAS token: ${error}` });
    }
}