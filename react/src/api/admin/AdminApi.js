import { fetchAuthSession } from '@aws-amplify/auth';

const url = import.meta.env.VITE_NODE_ENV === 'local' ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_API_URL;

const getToken = async () => {
    if (import.meta.env.VITE_NODE_ENV === 'local') {
        return 'local';
    } else {
        return (await fetchAuthSession()).tokens.accessToken.toString();

    }
}

export async function getPage(id) {
    const response = await fetch(`${url}/admin/page/get/${id}`, {
        headers: {
            Authorization: await getToken()
        }
    });

    return response.json();
}

export async function listPages() {
    const response = await fetch(`${url}/admin/page/list`, {
        headers: {
            Authorization: await getToken()
        }
    });
    return response.json();
}

export async function updateLink(id, link) {
    const response = await fetch(`${url}/admin/page/${id}/link/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(link)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function updateSocialLink(id, link) {
    const response = await fetch(`${url}/admin/page/${id}/social/link/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(link)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function reorderLinks(id, orderedLinkIds) {
    const response = await fetch(`${url}/admin/page/${id}/link/organize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(orderedLinkIds)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function reorderSocialLinks(id, orderedLinkIds) {
    const response = await fetch(`${url}/admin/page/${id}/social/link/organize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(orderedLinkIds)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function deleteLink(id, linkId) {
    const response = await fetch(`${url}/admin/page/${id}/link/remove/${linkId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}

export async function deletePage(id) {
    const response = await fetch(`${url}/admin/page/${id}/remove`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}

export async function deleteSocialLink(id, linkId) {
    const response = await fetch(`${url}/admin/page/${id}/social/link/remove/${linkId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}

export async function addLink(id, link) {
    const response = await fetch(`${url}/admin/page/${id}/link/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(link)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function addSocialLink(id, link) {
    const response = await fetch(`${url}/admin/page/${id}/social/link/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(link)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function updateBioInfo(id, page) {
    const response = await fetch(`${url}/admin/page/${id}/info/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify(page)
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}


export async function uploadProfileImage(id, file) {

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${url}/admin/upload/profile/image/id/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: await getToken()
        },
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function createPagte(id, name, descriptionTitle, imageUrl) {
    const response = await fetch(`${url}/admin/page/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
        body: JSON.stringify({
            id,
            bioInfo: {
                name,
                descriptionTitle,
                imageUrl
            }
        })
    });

    if (!response.ok) {
        console.error('Failed to make POST request:', response);
        throw new Error('Failed to make POST request');
    } else {
        const data = await response.json();
        return data;
    }
}

export async function checkIfAliasIsAvailable(id) {
    const response = await fetch(`${url}/admin/page/${id}/availability`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}

export async function updatePageid(id, newId) {
    const response = await fetch(`${url}/admin/page/${id}/update/pageId/${newId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}

export async function updatePageColors(id, colors) {
    const response = await fetch(`${url}/admin/page/${id}/update/colors`, {
        method: 'POST',
        body: JSON.stringify(colors),
        headers: {
            'Content-Type': 'application/json',
            Authorization: await getToken()
        },
    });

    return response.json();
}