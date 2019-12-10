import { http } from './http'

const baseUrl = '/api/category'

export const CategoryApi = {
    getCategory() {
        return http.get(baseUrl)
    },

    getCategoryName (id) {
        return http.get(baseUrl + '/' + id)
    },

    addCategory (name) {
        return http.post(baseUrl, {
            'name': name
        })
    },

    delCategory (id) {
        return http.delete(baseUrl + '/' + id)
    },

    editCategory (id,name) {
        return http.put(baseUrl + '/' + id, {
            'name': name
        })
    }
}