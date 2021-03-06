import axios from "axios";

const HOST = process.env.REACT_APP_HOST;

export function fetchNodesWhereName(options) {
    const axiosGet = axios.get(`${HOST}/api/nodes/`, { params: options });
    return axiosGet;
}