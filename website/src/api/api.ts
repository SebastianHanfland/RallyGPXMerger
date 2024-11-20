import { State } from '../planner/store/types.ts';

const baseUrl = 'http://localhost:3000';

export const createPlanning = (data: State, adminToken: string): Promise<string> => {
    return fetch(`${baseUrl}/plan/`, {
        method: 'post',
        body: JSON.stringify({ data, adminToken }),
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => (res.ok ? res.json() : 'nicht ok'));
};

export const updatePlanning = (id: string, data: State, adminToken: string) => {
    return fetch(`${baseUrl}/plan/${id}`, {
        method: 'put',
        body: JSON.stringify({ data, adminToken }),
        headers: { 'Content-Type': 'application/json' },
    });
};

export const deletePlanning = (id: string, adminToken: string) => {
    return fetch(`${baseUrl}/plan/${id}/${adminToken}`, { method: 'delete' });
};

export const getData = (id: string) => {
    return fetch(`${baseUrl}/plan/${id}`, { method: 'get' }).then((res) => res.json());
};
