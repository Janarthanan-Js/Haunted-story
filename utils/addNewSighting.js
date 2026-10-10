
import { getData } from "./getData.js";
import path from "path";
import fs from "fs/promises";

export async function addNewSighting(newsighting) {
    try {
        const data = await getData();

        const ids = data
            .map(sighting => Number(sighting.id))
            .filter(id => Number.isInteger(id) && id > 0);

        const newId = ids.length > 0
            ? Math.max(...ids) + 1
            : 1;

        newsighting.id = newId;
        data.push(newsighting);

        await fs.writeFile(
            path.join("data.json"),
            JSON.stringify(data, null, 2),
            "utf8"
        );

        return newsighting;

    } catch (error) {
        console.error("Failed to save sighting:", error);
        throw error;
    }
}