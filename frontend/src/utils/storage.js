export const setUser = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
  };
  
  export const removeUser = () => {
    sessionStorage.removeItem('user');
  };
  