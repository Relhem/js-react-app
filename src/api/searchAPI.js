import axios from "axios";

const HOST = process.env.REACT_APP_HOST;

export function fetchNodesWhereName(options) {
    console.log('options', options);
    const axiosGet = axios.get(`${HOST}/api/nodes/where/`, { params: options });
    return axiosGet;
}