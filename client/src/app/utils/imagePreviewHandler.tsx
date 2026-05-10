export const imageRender = (path:string|undefined|null)=> {
    const publicApi = import.meta.env.VITE_PUBLIC_API || 'http://localhost:8000';
    let pathExists = path == undefined || path == null ? false : true; 
    return pathExists ? publicApi + path : null;
}