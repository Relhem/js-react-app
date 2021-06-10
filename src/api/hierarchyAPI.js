import axios from "axios";

const HOST = process.env.REACT_APP_HOST;

export function fetchNodes(options) {
    const axiosGet = axios.get(`${HOST}/api/nodes/`, options);
    return axiosGet;
}

export function fetchNullNodes() {
    const axiosGet = axios.get(`${HOST}/api/nodes/null`);
    return axiosGet;
}

export function fetchChildrenForId(id) {
    const axiosGet = axios.get(`${HOST}/api/nodes/${id}/children`);
    return axiosGet;
}

export function deleteNode(id) {
    const axiosDelete = axios.delete(`${HOST}/api/nodes/delete/${id}`);
    return axiosDelete;
}

export function updateNode(id, options) {
    const axiosPut = axios.put(`${HOST}/api/nodes/update/${id}`, options);
    return axiosPut;
}

export function createNode(id, options) {
    const axiosPost = axios.post(`${HOST}/api/nodes/create/`, options);
    return axiosPost;
}