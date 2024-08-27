import PocketBase from 'pocketbase';
import { State } from '../planner/store/types.ts';
import { sha256 } from 'js-sha256';

const pb = new PocketBase('http://127.0.0.1:8090');

const applySimpleHash = (a: string, salt: string) => sha256(salt + a);

export const createPlanning = (data: State, password: string): Promise<string> => {
    return pb
        .collection('planning')
        .create({ data })
        .then((planning) => {
            pb.collection('permissions').create({
                planning_id: planning.id,
                password_hash: applySimpleHash(password, planning.id),
            });
            return planning.id;
        });
};
export const updatePlanning = (id: string, data: State, password: string) => {
    pb.collection('planning').update(id, { data, password_hash: applySimpleHash(password, id) });
};
export const deletePlanning = (id: string, password: string) => {
    pb.collection('planning').delete(id, { password_hash: applySimpleHash(password, id) });
};
export const getData = (id: string) => {
    return pb.collection('planning').getOne(id);
};
