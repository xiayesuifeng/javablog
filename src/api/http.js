import axios from 'axios'

const request = function (url, params, method) {
    return new Promise((resolve, reject) => {
        axios[method](url, params)
            .then(response => {
                if (response.data.code === 200)
                    resolve(response.data)
                else
                    reject(new Error(response.data.message))
            }).catch(err => {
            reject(err)
        })
    })
}

export const http = {
    get (url) {
        return request(url, undefined, 'get')
    },

    post (url, params = undefined) {
        return request(url, params, 'post')
    },

    put (url, params = undefined) {
        return request(url, params, 'put')
    },

    patch (url, params = undefined) {
        return request(url, params, 'patch')
    },

    delete (url) {
        return request(url, undefined, 'delete')
    }
}

