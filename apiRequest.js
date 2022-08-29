import dotenv from 'dotenv'
dotenv.config();

const connectionCache = {}

async function getConnection(){
  const {
    COMPANY_SITE,
    AUTH_STRING,
    CLIENT_ID,
    COMPANY_ID
  } = process.env;

  return connectionCache?.connection || fetch(`https://${COMPANY_SITE}/login/companyinfo/${COMPANY_ID}`).then(res => {
    return res.json()
  }).then(json => {
    const {Codebase} = json //their capitalization, not mine
    connectionCache.connection = {
      url: `https://${COMPANY_SITE}/${Codebase}/apis/3.0/`,
      headers: new Headers({
        'Authorization': AUTH_STRING,
        'clientId': CLIENT_ID
      }),
    }
    return connectionCache.connection
  })
}

export default async function createApiRequest(route){
  return await getConnection().then(connection => {
    console.log(connection.headers)

    return fetch(connection.url + route, {
      headers: connection.headers,
    }).then(async res => {
      if(res.ok){
        return await res.json();
      }
      else {
        const {status, statusText} = res;
        return {error: {
          status,
          statusText
        }}}
    })
  })
}