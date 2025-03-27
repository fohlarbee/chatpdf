import { Pinecone  } from '@pinecone-database/pinecone';
import { downloadFromAzure } from './azure-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToAscii } from './utils';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  

});
 type PDFPage = {
  pageContent: string;
  metadata: {
    loc:{pageNumber: number}
  }
}


export async function loadAzureBlobIntoPinecone(fileName: string){
  // 1. Obtain the pdf - download and read from pdf
    const file  = await downloadFromAzure(fileName);
    if (!file) {
        console.error('Error downloading file');
        return;
    }
   
    const loader = new PDFLoader(file);
    const loadedDocs = await loader.load();
    // console.log('loader', loader);
    // console.log('loadedDocs', loadedDocs);
    
    const doc: PDFPage[] = loadedDocs.map(d => ({
        pageContent: d.pageContent,
        metadata: {
            loc: { pageNumber: d.metadata.loc.pageNumber }
        }
    }));
    // 2. Split and segment the PDF
    const singlePage = await Promise.all(doc.map(page => prepareDocument(page)));
    // console.log('singlePage', singlePage);

    // 3. Vectorize and embed individual documents
    const vectors = await Promise.all(singlePage.flat().map(page => embedDocument(page)));
    // 4. Upload to Pinconedb
    const pinconeIndex =  pc.index('chatpdf', process.env.PINECONE_HOSTNAME);

    const namespace = convertToAscii(fileName);
    await pinconeIndex.namespace(namespace).upsert(
     await Promise.all( vectors.map(async v => ({
        id: v.id,
        values: v.values as number[],
        metadata: {
          text: await Promise.resolve(v.metadata.text),
          pageNumber: v.metadata.pageNumber
        }
      }))
    ));
  
    return singlePage[0];
    
}

async function embedDocument(doc: Document){
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    // Extract the float array from the embeddings object
    const values = Array.isArray(embeddings) ? embeddings.flat() : embeddings.float;

    return {
      id:hash as string,
      values: values,
      metadata:{
        text:await doc.metadata.text as string,
        pageNumber: doc.metadata.pageNumber as number
      }
    }
    
  } catch (error) {
    console.log(error);
    throw new Error('Error getting embeddings');
  }
}
export async function truncateStringByBytes(str: string, bytes: number){
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument (page: PDFPage) {
  let { pageContent } = page;
  const { metadata } = page;
  pageContent = pageContent.replace(/\n/g, '');
   
  // Split the doc
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata:{
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000)
      }
    })
  ]);

  return docs
}