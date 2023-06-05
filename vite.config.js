import {defineConfig} from 'vite'

import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
    plugins:[
        uni()
    ],
    server:{
        proxy:{
            "/htmlfile" : {
                target : "https://m.hupu.com/bbs/",
                changeOrigin : true,
                secure:true,
                rewrite:path=>{
                    return path.replace(/^\/htmlfile/,'')
                }
            },
        }
    }
})