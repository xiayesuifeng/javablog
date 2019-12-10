import { http } from './http'

const baseUrl = '/api/article'

export const ArticleApi = {
    getArticle () {
        return http.get(baseUrl)
    },

    getArticleByCategory (id) {
        return http.get(baseUrl + '/category/' + id)
    },

    getArticleById (id) {
        return http.get(baseUrl + '/id/' + id)
    },

    getArticleByTag (tag) {
        return http.get(baseUrl + '/tag')
    },

    getArticleMDByUUID(uuid) {
        return http.get(baseUrl + '/uuid/'+uuid+'/markdown')
    },

    addArticle (data) {
        return http.post(baseUrl,data)
    },

    editArticle (id,data) {
        return http.put(baseUrl+'/'+id,data)
    },

    deleteArticle(id) {
        return http.delete(baseUrl+'/'+id)
    }
}