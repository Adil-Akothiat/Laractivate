export const toSnakeCase = (str:string)=> {
    return str
    .replace(/\s+/g, '_')   // Replace spaces with underscores
    .toUpperCase();          // Capitalize everything
}