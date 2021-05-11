import $ from 'jquery';
import * as config from './config';

function callApi(url, method = 'GET', data = {}, header = {}) {
    return $.ajax({
        type: method,
        url: config.API_URL + url,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: header,
        async: false,
        success: function (res, textStatus, xhr) {
            return res.data;
        },
        error: function (res, textStatus, errorThrown) {
            return JSON.parse(res.responseText);
        }
    });
}

const getToken = () => {
    const token = localStorage.getItem('token');
    if (token === 'undefined') {
        return "";
    }
    return token;
}

async function getAllTasks(needFilter = false, filterStatus = null) {
    const token = getToken();
    let url = '/tasks';
    if (needFilter) {
        const status = filterStatus == true ? 'completed' : 'uncompleted';
        url += `?filterType=${status}`;
    }
    return await callApi(url, 'GET', {}, { token: token });
}

async function getTasksById(id) {
    const token = getToken();
    return await callApi(`/tasks/${id}`, 'GET', {}, { token: token });
}

async function addTask(data) {
    const token = getToken();
    return await callApi('/tasks', 'POST', data, { token: token });
}

async function updateTask(id, data) {
    const token = getToken();
    return await callApi(`/tasks/${id}`, 'PATCH', data, { token: token });
}

async function deleteTask(id) {
    const token = getToken();
    return await callApi(`/tasks/${id}`, 'DELETE', {}, { token: token });
}

async function getReport() {
    const token = getToken();
    return await callApi('/reports', 'GET', {}, { token: token });
}

async function register(data) {
    const res = await callApi('/auth/register', 'POST', data);

    if (res.status == 401) {
        return {
            'status': 'failed',
            'msg': resText.errors.email,
        }
    }

    if (res.status == 400) {
        return {
            'status': 'failed',
            'msg': 'Information Incorrect',
        }
    }

    return {
        'status': 'success',
        'msg': 'Please verify your email',
    }
}

async function login(data) {
    const res = await callApi('/auth/signin', 'POST', data);
    if (res.status == 401) {
        return {
            'status': 'failed',
            'msg': res.errors.email,
        }
    }

    return {
        'status': 'success',
        'msg': 'Login Successfully',
        'token': res.data.token,
    }
}

async function getUser(token) {
    return await callApi('/user', 'GET', {}, {token: token});
}

export {
    getAllTasks,
    getTasksById,
    addTask,
    updateTask,
    deleteTask,
    getReport,
    register,
    login,
    getUser,
    getToken,
};
