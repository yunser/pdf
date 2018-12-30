let debug = process.env.NODE_ENV !== 'production'

let imgDomain
let apiDomain
let domain
if (process.env.NODE_ENV === 'production') {
    imgDomain = 'http://120.79.29.47'
    apiDomain = 'http://example.yunser.com'
    domain = {
        api: 'http://java.api.yunser.com/',
        api2: 'https://nodeapi2.yunser.net',
        imgApi: 'https://nodeapi.yunser.com',
        img1: 'https://img1.yunser.com'
    }
} else {
    imgDomain = 'http://120.79.29.47'
    // apiDomain = 'http://localhost:1030'
    apiDomain = 'http://localhost:1030'
    // apiDomain = 'http://java.api.yunser.com/'
    domain = {
        api: 'http://localhost:1026',
        api2: 'http://localhost:1028',
        // api2: 'https://nodeapi2.yunser.net',
        // api: 'http://java.api.yunser.com/',
        imgApi: 'https://nodeapi.yunser.com',
        // imgApi: 'http://localhost:1026',
        img1: 'https://img1.yunser.com'
    }
}

module.exports = {
    imgDomain,
    apiDomain,
    debug,
    domain
}
