import PocketBase from 'pocketbase';
import { State } from '../planner/store/types.ts';

const pb = new PocketBase('http://127.0.0.1:8090');

// TODO bcrypt
const hash = (a: string, seed: string) => a + seed;

export const createPlanning = (data: State, password: string): Promise<string> => {
    return pb
        .collection('planning')
        .create({ data })
        .then((planning) => {
            pb.collection('permissions').create({
                planning_id: planning.id,
                password_hash: hash(password, planning.id),
            });
            return planning.id;
        });
};
export const updatePlanning = (id: string, data: State, password: string) => {
    pb.collection('planning').update(id, { data, password_hash: hash(password, id) });
};
export const deletePlanning = (id: string, password: string) => {
    pb.collection('planning').delete(id, { password_hash: hash(password, id) });
};
export const getData = (id: string) => {
    return pb.collection('planning').getOne(id);
};
