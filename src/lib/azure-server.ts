import { BlobServiceClient } from '@azure/storage-blob';
import fs from 'fs';
// import path from 'path';
import path from 'path';





const AZURE_STORAGE_CONNECTION_STRING = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING as string;
const AZURE_STORAGE_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME as string;
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

export async function downloadFromAzure(fileName: string): Promise<string | void> {
    try {
         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
         const containerClient = blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
         const blobClient = containerClient.getBlobClient(fileName);
     
         const downloadBlockBlobResponse = await blobClient.download(0);
         if (!downloadBlockBlobResponse.readableStreamBody) {
             throw new Error('Readable stream body is undefined');
         }
         const dirPath = path.join(process.cwd(), 'src', 'lib');
         if (!fs.existsSync(dirPath)) {
             fs.mkdirSync(dirPath, { recursive: true });
         }
         const file = `tmp/pdf-${Date.now()}.pdf`
         const filePath = path.join(dirPath, file);
         fs.writeFileSync(filePath, await streamToBuffer(downloadBlockBlobResponse.readableStreamBody));
         return filePath;
        
    } catch (error) {
        if (error instanceof Error) return console.error(error.message);
        console.error('Error downloading file:', error);
    }

    
}

