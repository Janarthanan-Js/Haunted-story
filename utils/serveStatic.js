import path from 'path';
import fs from 'fs/promises';
import { sendResponse } from './sendResponse.js';
import { getContentType } from './getContentType.js';

export async function serveStatic(req, res, basedir) {

    // Remove query string (?v=2 etc.) so it doesn't become part of the filename
    const urlPath = req.url.split('?')[0];

    const filePath = path.join(basedir, urlPath === '/' ? 'index.html' : urlPath);

    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    try {
        const content = await fs.readFile(filePath);
        sendResponse(res, 200, contentType, content);
    } catch (error) {
        if(error.code === 'ENOENT') {
        // Always answer the request, otherwise the browser hangs
           sendResponse(res, 404, 'text/html', '<h1>404 - Not Found</h1>');
    }
}
}