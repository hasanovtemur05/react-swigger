import https from "./config";

const brandCategory = {
   create: (data) => https.post("/brand-category/create", data),
   get: (params) => https.get("/brand-category/search",{params}),
   brandCategoryId: (id) => https.get(`/brand-category/brand/${id}`),
   update: (id, data) => https.patch(`/brand-category/update/${id}`, data),
   delete: (id) => https.delete(`/brand-category/delete/${id}`),
   getBrand: (id) => https.get(`/brand-category/brand/${id}`),
};

export default brandCategory;
