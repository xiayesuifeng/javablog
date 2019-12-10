import { http } from './http'

const baseUrl = '/api/comment'

export const CommentApi = {
    getComment (id) {
        return http.get(baseUrl+'/'+id)
    },

    addComment (id,comment) {
        console.log({
            'id': id,
            'comment': comment
        })
        return http.post(baseUrl, {
            'id': id,
            'comment': comment
        })
    },

    delComment (id) {
        return http.delete(baseUrl + '/' + id)
    },
}