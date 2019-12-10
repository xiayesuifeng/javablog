import { http } from './http'

export const AdminApi = {
    login (username,password) {
        return http.post('/api/login', {
            'username': username,
            'password': password
        })
    },

    logout() {
        return http.post('/api/logout')
    },

    signup(avatar,username,password) {
        return http.post('/api/signup',{
            'avatar': avatar,
            'username': username,
            'password': password
        })
    },

    getUsers () {
        return http.get('/api/user')
    },

    getUser (username) {
        return http.get('/api/user/' + username)
    },

    editUser (id,data) {
        return http.put('/api/user/'+id,data)
    },

    deleteUser(id) {
        return http.delete('/api/user/'+id)
    }
}