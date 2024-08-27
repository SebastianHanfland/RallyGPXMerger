import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const id = 'abcabcabcabcabc';
const pw = 'pw';

const hash = (a: string, seed: string) => a + seed;

export const saveData = () => {
    pb.collection('planning')
        .create({ id, data: { a: 'a' } })
        .then((planning) => {
            pb.collection('permissions').create({
                planning_id: planning.id,
                password_hash: hash(pw, planning.id),
            });
        });
};
export const updateData = () => {
    pb.collection('planning').update(id, { data: { b: 'b' }, password_hash: hash(pw, id) });
};
export const deleteData = () => {
    pb.collection('planning').delete(id, { password_hash: hash(pw, id) });
};
export const getData = () => {
    return pb.collection('planning').getOne(id);
};
