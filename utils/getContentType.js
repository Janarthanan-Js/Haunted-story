export function getContentType(ext) {
    const types = {
        "js": "text/javascript",
        "css": "text/css",
        "html": "text/html",
        "json": "application/json",
        "png": "image/png",
        "jpg": "image/jpeg",
        "gif": "image/gif",
        "svg": "image/svg+xml",
        "ico": "image/x-icon",
    };

    // path.extname() returns ".css", so remove the leading dot first
    const cleanExt = ext.replace(".", "").toLowerCase();

    // Fallback: generic binary type (no trailing space this time)
    return types[cleanExt] || "application/octet-stream";
}