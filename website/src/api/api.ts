import { State } from '../planner/store/types.ts';
import { isOldState } from '../migrate/types.ts';
import { migrateVersion1To2 } from '../migrate/migrateVersion1To2.ts';
import { StateOld } from '../planner/store/typesOld.ts';

// const baseUrl = 'http://localhost:3000';
const baseUrl = 'https://hase.uber.space/bike';

export const createPlanning = (data: State, adminToken: string): Promise<string> => {
    return fetch(`${baseUrl}/`, {
        method: 'post',
        body: JSON.stringify({ data, adminToken }),
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => (res.ok ? res.json() : 'nicht ok'));
};

export const updatePlanning = (id: string, data: State, adminToken: string) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'put',
        body: JSON.stringify({ data, adminToken }),
        headers: { 'Content-Type': 'application/json' },
    });
};

export const deletePlanning = (id: string, adminToken: string) => {
    return fetch(`${baseUrl}/${id}/${adminToken}`, { method: 'delete' });
};

const getDataFromServer = (id: string) => {
    return fetch(`${baseUrl}/${id}`, { method: 'get' }).then((res) => res.json());
};

export const getData = (id: string): Promise<State> => {
    return getDataFromServer(id)
        .then((res) => res.data)
        .then((state: State | StateOld) => {
            return isOldState(state) ? migrateVersion1To2(state) : state;
        });
};
