"use client";
import { uploadPdfToAzure } from '@/lib/azureUpload';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react';
import {useDropzone } from 'react-dropzone';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const FileUpload = ({userLimitReached}: {userLimitReached:boolean}) => {
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const {mutate,isPending} = useMutation({
        mutationFn: async(
            {fileName, fileKey, pdfUrl} : {fileName: string, fileKey: string, pdfUrl: string}
        ) => {
            const response = await axios.post('/api/create-chat', {fileName, fileKey, pdfUrl});
            return response.data;
        }
})
    const {getRootProps, getInputProps} = useDropzone({
        accept:{'application/pdf': ['.pdf']},
        maxFiles:1,
        onDrop: async(acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024){
                alert('Kindly upload a smaller file');
                return
            }
            try {
                setUploading(true);
                if (userLimitReached) 
                    return toast.error('Please ugrade to Pro...limit reached');
                   
                const data = await uploadPdfToAzure(
                    await file.arrayBuffer(),
                     file.name
                    );
                    const {fileName, fileKey, pdfUrl} = data as {fileName: string, fileKey: string, pdfUrl: string};
                    if (!fileName || !fileKey || !pdfUrl) return alert('Something went wrong');
                    mutate(data!, {
                        onSuccess: ({chatId}) => {
                            toast.success('Chat created successfully');
                            router.push(`/chats/${chatId}`);  

                        },
                        onError:(err) => {
                            toast.error('Failed to create chat');
                            console.log(err);
                        }
                    });
               
            } catch (error) {
                console.error(error)
                
            }finally{setUploading(false)}
        }
    }); 
  return (
    <div className='p-2 bg-[#fff] rounded-xl'>
        <div {...getRootProps({

            className:'border-dashed border-2 border-gray-30 p-4 rounded-xl cursor-pointer py-8 flex justify-center items-center flex-col'
        })}>
             <input {...getInputProps()}/>
             {uploading || isPending ? (
                // isPending state
                <>
                  <Loader2 className='h-10 w-10 text-blue-500 animate-spin'/>
                    <p className='text-gray-500 mt-2 text-sm'>Uploading...</p>
                </>
             ) : (
                //  default state
                <>
                <Inbox className='w-10 h-10 text-blue-500'/>
                <p className='text-gray-500 mt-2 '>Drag and drop your file here</p>
                </>
   
             )}
            
        </div>
    </div>
  )
}

export default FileUpload