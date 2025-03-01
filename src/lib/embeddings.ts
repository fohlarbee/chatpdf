// import {OpenAIApi, Configuration} from 'openai-edge';
import {CohereClient} from 'cohere-ai'

// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY
// });

// const  openai = new  OpenAIApi(config);


// export async function getEmbeddings(text: string){

//     try {
//         const response = await openai.createEmbedding({
//             model:'text-embedding-3-small',
//             input: text.replace(/\n/g, ' '),

//         });
//         const result = await response.json();
//         console.log('openai embedding result' ,result);
//         return result.data[0].embedding as number[];
        
//     } catch (error) {
//         console.log(error);
//         throw new Error('Error getting embeddings');
//     }
// }

const cohere = new CohereClient({
    token: process.env.COHEREAI_API_KEY,

});

export async function getEmbeddings(text: string){
    try {

        
        const res  = await cohere.embed({
            texts: [text.replace(/\n/g, ' ')],
            model:'embed-english-v3.0',
            embeddingTypes: ['float'],
            inputType: "classification",
            truncate: "NONE"
        });
        // Extract the embedding from the res
        return res.embeddings;
    } catch (error) {
        console.log(error);
        throw new Error('Error getting embeddings');
    }
}

