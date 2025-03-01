import React from 'react'

const PDFViewer = ({pdfUrl}: {pdfUrl: string}) => {
  return (
   <iframe src={pdfUrl}
   allowFullScreen
   loading='lazy'
   
   style={{ width: '100%', height: '100%' }}
   className='w-full h-full bg-[#fff]'
   ></iframe>
  )
}

export default PDFViewer