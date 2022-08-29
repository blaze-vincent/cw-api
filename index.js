import createApiRequest from "./apiRequest.js";

createApiRequest('company/companies/IdealReadyMix').then(res => {
  console.log(res)
})