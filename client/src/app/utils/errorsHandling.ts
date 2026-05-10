export const getErrorsMessages = (error:any)=> {
  console.log(error);
  if(error?.response?.data?.errors) {
    return Object.values(error.response.data.errors);
  }
  if(error?.response?.data?.error) {
    return [error.response.data.error];
  }
  if(error?.response?.data?.message) {
    return [error.response.data.message];
  }
  return ["An error occurred"];
}