import {CohereClient} from 'cohere-ai'



const cohere = new CohereClient({
    token: process.env.COHEREAI_API_KEY,

});

export async function getEmbeddings(text: string){
    try {

        
        const res  = await cohere.embed({
            texts: [text.replace(/\n/g, ' ')],
            model:'embed-english-v3.0',
            embeddingTypes: ['float'],
            inputType: "search_document",
            // truncate: "NONE"
        });
        // Extract the embedding from the res
        return res.embeddings;
    } catch (error) {
        console.log(error);
        throw new Error('Error getting embeddings');
    }
}

