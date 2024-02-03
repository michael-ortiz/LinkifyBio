const url = 'https://5hemoatd625go3vvm3com5es6u0oinwm.lambda-url.us-east-1.on.aws';

export async function getBioData(pageId) {
    const response = await fetch(`${url}/${pageId}`);
    return response.json();
}

export async function incrementClickView(pageId, linkId) {
    const response = await fetch(`${url}/${pageId}/click/link/${linkId}`, {
        method: 'PUT'
    });
    
}