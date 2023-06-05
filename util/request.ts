
let baseurl = ''
export const request = async (body:any) => {
  const { url, method, contentType, timeout, dataType, params} = body
  // #ifdef APP-PLUS
    if (url.includes('pcmapi')||url.includes('html')) {
        baseurl='https://bbs.hupu.com/'
    }
    if (url.includes('8.0.34')) {
        baseurl='https://bbs.mobileapi.hupu.com/1'
    }
    // #endif
  return new Promise(async(resolve, reject) => {

        uni.request({
          url: `${baseurl}${url}`,
          method: method || 'GET',
          header: {
            'ContentType': contentType || 'application/json',
          },
          timeout: timeout || 60000,
          dataType: dataType || "json",
          data: params,
          success: (response) => {
            const data = response.data
            return resolve(data)
          },
          fail: (response) => {
            return reject('networkerror')
          }
        })
  })
}
