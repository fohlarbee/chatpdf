import { BlobServiceClient,  } from '@azure/storage-blob';
import axios from 'axios';
const AZURE_STORAGE_ACCOUNT_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME as string;
const AZURE_STORAGE_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME as string;


const getSASToken = async (fileName: string) => {
  const response = await axios.post('/api/sastoken', { fileName });
 
  return response.data.sasToken;
};
const uploadPdfToAzure = async (arrayBuffer: ArrayBuffer, fileName: string): Promise<{ fileKey: string; fileName: string, pdfUrl: string } | void> => {
  
    try {
      // Extract the file name without the extension
      const fileNameWithoutExtension = fileName.replace(/\.pdf$/i, '');
      // Sanitize the file name
      const sanitizedFileNameWithoutExtension = fileNameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, '_');
      // Append the .pdf extension back to the sanitized file name
      const sanitizedFileName = `${sanitizedFileNameWithoutExtension}.pdf`;      

      const sasToken = await getSASToken(sanitizedFileName);
      const blobServiceClient = new BlobServiceClient(
              `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`,
            );
        
            // const containerName = AZURE_STORAGE_CONTAINER_NAME;
            const containerClient = blobServiceClient.getContainerClient(
              AZURE_STORAGE_CONTAINER_NAME
            );
        
            // const blobName = sanitizedFileName;
            // const blobClient = containerClient.getBlockBlobClient(blobName);
            const blockBlobClient = containerClient.getBlockBlobClient(sanitizedFileName);
      
            await blockBlobClient.uploadData(arrayBuffer, {
              blobHTTPHeaders: { blobContentType: "application/pdf" }
          });
          return {
            fileKey: fileName + Date.now(),
            fileName: sanitizedFileName,
            pdfUrl: blockBlobClient.url
          };
        
        
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error uploading file: ${error.message}`);
        } else {
            console.error('Error uploading file:', error);
        }
    }
};

;

export { uploadPdfToAzure };