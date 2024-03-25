const OpenAI = require("openai").OpenAI;
const dotenv = require("dotenv");
dotenv.config({path: "./config/config.env"});


const openai = new OpenAI({
    apiKey: "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"
});

async function main(){

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "system", content: "You are a helpful assistant." }],
    }).catch((err)=>{
        console.log(err);
    })

    console.log(response.choices[0]);
}
main();