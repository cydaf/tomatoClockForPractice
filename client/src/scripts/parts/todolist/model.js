import * as api from '../../api';
import { showLoginCard, blurBackground } from "../../auth"

var token = api.getToken();

const checkHasToken = () => {
    if (token == "" || token == null) {
        showLoginCard();
        blurBackground();
        return false;
    }
    return true;
}

async function getTodolist() {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return;
    }
    var res = await api.getAllTasks();
    return res.tasks;
}

async function getTodolistByStatus(status) {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return;
    }
    var res = await api.getAllTasks(true, status);
    return res.tasks;
}

async function setFinishTodolist(id) {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return;
    }
    return await api.updateTask(id, {
        completed: true
    });
}

async function editItemById(id, text) {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return;
    }
    await api.updateTask(id, {
        content: text
    });
}

async function deleteItemById(id) {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return;
    }
    return await api.deleteTask(id);
}

async function getReport() {
    const hasToken = checkHasToken();
    if (!hasToken) {
        return null;
    }
    return await api.getReport();
} 

export {
    setFinishTodolist,
    deleteItemById,
    getTodolist,
    editItemById,
    getTodolistByStatus,
    getReport
}
