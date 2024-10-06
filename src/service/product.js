import https from "./config";

const product = {
  create: (data) => https.post("/products/create", data ), 
  get: (params) => https.get("/products/search", {params}),
  update: (id, data) => https.patch(`/products/update/${id}`, data),
  delete: (id) => https.delete(`/products/delete/${id}`)
};


export default product;