const devConfig = {
    "MONGODB_URL": "",
    "PORT": process.env.PORT | 3000,
}

const authConfig = {
    JWT_SECRET: "",
    OAUTH: {
        google: {
            clientID: "",
            clientSecret: ""
        },
        facebook: {
            clientID: "",
            clientSecret: ""
        }
    }

}



export default {
    ...devConfig,
    ...authConfig
}