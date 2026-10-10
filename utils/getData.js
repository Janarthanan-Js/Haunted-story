import path from 'path'
import fs from 'fs/promises'

export async function getData(){
    try{
        const pathJSON=path.join('data.json')
        const filePath=await fs.readFile(pathJSON, 'utf8')
        const data=JSON.parse(filePath)
        return data
    } catch (error) {
        console.log(error)
        return []
    }
}