import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";


type Embeddings = number[][] | { float: number[] };

export async function  getMatchesFromEmbeddings(embeddings: Embeddings, fileName: string){


    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    const pinconeIndex =  pc.index('chatpdf', process.env.PINECONE_HOSTNAME);

    try {
         const namespace = convertToAscii(fileName);
         const values = Array.isArray(embeddings) ? embeddings.flat() : embeddings.float;

         const queryResult = await pinconeIndex.namespace(namespace).query({
            vector: values,
            topK: 5,
            includeMetadata: true,
            includeValues:true
         });
         return queryResult.matches || [];
        
        
    } catch (error) {
        console.log(error);
        throw new Error('Error getting embeddings');
    }

}

export async function getContext(query: string, fileName: string){
    const embeddings = await getEmbeddings(query)  as number[][] | { float: number[] };

    
    const matches = await getMatchesFromEmbeddings(embeddings, fileName);
    // console.log('matches', matches);

    const qualifyingDocs = matches.filter(match => match.score && match.score >= 0.2);
    // console.log('qualifyingDocs', qualifyingDocs);

    type MetaData = {
        text: string,
        pageNumber: string
    }

    const docs = qualifyingDocs.map(match => (match.metadata as MetaData).text);
    // console.log('docs', docs);
    return docs.join('\n').substring(0, 3000);
}
