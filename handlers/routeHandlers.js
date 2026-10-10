import { sendResponse } from "../utils/sendResponse.js"
import {getData} from "../utils/getData.js"
import { parseJSONBody } from "../utils/parseJSONBody.js"
import { addNewSighting } from "../utils/addNewSighting.js"
import  { sanitizeInput } from "../utils/sanitize-input.js"
import { sightingEvents } from "../events/sightingEvents.js"
import { stories } from "../stories.js"
export async function handleGet(res){
    const data=await getData()
    const k=JSON.stringify(data)
    sendResponse(res,200,"application/json",k)

}

export async function handlePost(req, res) {
    try {
        const parsedBody = await parseJSONBody(req);
        const sanitizedBody = sanitizeInput(parsedBody);

        await addNewSighting(sanitizedBody);

        sightingEvents.emit("sighting-added", sanitizedBody);

        sendResponse(
            res,
            201,
            "application/json",
            JSON.stringify(sanitizedBody)
        );

    } catch (error) {
        console.error("POST Error:", error);

        sendResponse(
            res,
            400,
            "application/json",
            JSON.stringify({ error: error.message })
        );
    }
}

export async function handleNews(req,res){
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'})
    const send=()=>{
        const story=stories[Math.floor(Math.random()*stories.length)]
        res.write('data: '+JSON.stringify({event:'news-update',story})+'\n\n')
    }
    send()                                   // first headline right away
    const id=setInterval(send,3000)
    req.on('close',()=>clearInterval(id))    // stop when the browser leaves
}

