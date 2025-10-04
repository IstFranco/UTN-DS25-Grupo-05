
export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("empresa");
}

export function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}


export function getUserData() {
    const token = getToken();
    return token ? parseJWT(token) : null;
}


export function isTokenExpired() {
    const userData = getUserData();
    if (!userData || !userData.exp) return true;
    
    return userData.exp * 1000 < Date.now();
}


export function getUserType() {
    const userData = getUserData();
    return userData?.userType || null;
}