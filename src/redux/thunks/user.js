import { createAsyncThunk } from '@reduxjs/toolkit'
import { api, fetchCsrfCookie } from "../../services/api"

export const login = createAsyncThunk("users/login", async (credentials, thunkApi) => {

    try {
        await fetchCsrfCookie()
        const { data } = await api.post('/session', {email: credentials.email, password: credentials.password} )

        const user = data
        return user
    }
    catch (error) {
        console.log(error)

        if (error.response.status === 401)
            return thunkApi.rejectWithValue({
                status: 401,
                message: 'Identifiants invalides'
            })

        if (error.response.status === 403)
            return thunkApi.rejectWithValue({
                status: 403,
                message: "Votre compte est désactivé. Veuillez contacter le gérant de l'organisation."
            })

        return thunkApi.rejectWithValue({ 
            status: 500, 
            message: "Une erreur s'est produite lors de la connexion." 
        });
    }
})

export const logout = createAsyncThunk("users/logout", async ( thunkApi) => {

    try {
        await fetchCsrfCookie()
        const { data } = await api.delete('/session', )

        const user = data
        return user

    }
    catch (error) {
        console.log(error)

        return thunkApi.rejectWithValue({ 
            status: 500, 
            message: "Une erreur s'est produite lors de la connexion." 
        });
    }
})

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, thunkApi) => {
    try {
        const { data: user } = await api.get('/session/user')

        // If the user is not authenticated, the response is just an empty
        // string: it's converted to null for better reliability and consistency
        return user || null
    } catch (error) {
        return thunkApi.rejectWithValue({ status: 500, message: "Une erreur s'est produite" });
    }
})

export const addUser = createAsyncThunk("user/addUser", async (data, thunkAPI) => {
    try {
        await fetchCsrfCookie()

        const formData = new FormData()
        for (let [key,value] of Object.entries(data)) {
            if (key === 'profilePicture' && !value) continue
            formData.append(key, value)
        }

        const { data: user } = await api.post('/users',formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return user
    }
    catch (error) {
        // Laravel sends a custom 422 status code when the request is rejected
        // with validation errors; they must be transmitted directly to the
        // form, where each messages will be displayed under their corresponding
        // fields.
        if ([410, 422].includes(error.response.status)) {
            return thunkAPI.rejectWithValue(error);
        }

        return thunkAPI.rejectWithValue({status: 500, message: "Une erreur s'est produite"});
    }
})

export const updateUser = createAsyncThunk("user/updateUser", async (data, thunkAPI) => {
    try {
        await fetchCsrfCookie()

        const id = thunkAPI.getState().user.id;
        const formData = new FormData()
        for (let [key,value] of Object.entries(data)) {
            if (key === 'currentPassword' && !value) continue
            if (key === 'newPassword' && !value) continue
            if (key === 'profilePicture' && value === undefined) continue
            formData.append(key, value)
        }

        const response = await api.post(`/users/${id}`,formData, {
            params: {
                _method: 'PATCH'
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response.data
    }
    catch (error) {
        console.log(error)

        // Laravel sends a custom 422 status code when the request is rejected
        // with validation errors; they must be transmitted directly to the
        // form, where each messages will be displayed under their corresponding
        // fields.
        if (error.response.status === 422) {
            return thunkAPI.rejectWithValue(error);
        }

        return thunkAPI.rejectWithValue({status: 500, message: "Une erreur s'est produite"});
    }
})
