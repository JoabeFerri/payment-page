import axios from 'axios';

const API_KEY = '$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmYyNjQ4ZWFjLWE1NzAtNDNlZS1hMDYwLTJmYzlkZTMxMzJiOTo6JGFhY2hfMmZhNTFkZmQtZGUzNC00Y2RkLTk3ZmUtODgyMzYxZTk5NWIx';
const BASE_URL = 'https://sandbox.asaas.com/api/v3'; // Use 'https://www.asaas.com/api/v3' para produção

const asaasApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': API_KEY
  }
});

export default asaasApi;
