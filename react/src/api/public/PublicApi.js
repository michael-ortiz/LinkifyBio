const url = import.meta.env.VITE_NODE_ENV === 'local' ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_API_URL;

export async function getPublicPage(pageId) {
    const response = await fetch(`${url}/page/get/${pageId}`);
    return response.json();
}

export async function incrementClickView(pageId, linkId) {
    const response = await fetch(`${url}/${pageId}/click/link/${linkId}`, {
        method: 'PUT'
    });
    
}