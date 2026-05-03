
// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************


export const getUsuario = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};