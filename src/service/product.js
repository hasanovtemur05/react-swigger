import https from "./config";

const product = {
  create: (data) => https.post("/product/create", data ), 
  get: (params) => https.get("/product/search", {params}),
  update: (id, data) => https.patch(`/product/update/${id}`, data),
  delete: (id) => https.delete(`/product/delete/${id}`)
};


export default product;