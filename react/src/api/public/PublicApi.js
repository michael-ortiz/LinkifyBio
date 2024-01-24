const url = 'https://5hemoatd625go3vvm3com5es6u0oinwm.lambda-url.us-east-1.on.aws';

export async function getBioData(id) {
    const response = await fetch(`${url}/${id}`);
    return response.json();
}