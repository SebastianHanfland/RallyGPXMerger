import fs from 'fs';
import * as dotenv from 'dotenv';
import { RallyPlan } from '../types';

dotenv.config();
const PLANS_DIRECTORY = 'plans';

export const createFile = (planId: string, rallyPlan: RallyPlan) => {
    try {
        const plan = readFile(planId);
        if (!plan && rallyPlan.adminToken) {
            return fs.writeFileSync(getFilename(planId), JSON.stringify(rallyPlan));
        }
        throw new Error('Plan existierte bereits');
    } catch (err) {
        console.error(err);
        throw new Error('Konnte neue Datei nicht anlegen');
    }
};

export const updateFile = (planId: string, rallyPlan: RallyPlan) => {
    try {
        const plan = readFile(planId);
        if (rallyPlan.adminToken && plan?.adminToken && rallyPlan.adminToken === plan.adminToken) {
            return fs.writeFileSync(getFilename(planId), JSON.stringify(rallyPlan));
        }
        throw new Error('Falsche id oder admin Token');
    } catch (err) {
        console.error(err);
        throw new Error('Falsche id oder admin Token');
    }
};

function getFilename(planId: string) {
    return `${PLANS_DIRECTORY}/${planId}.json`;
}

export const readFile = (planId: string) => {
    const filename = getFilename(planId);

    try {
        const buffer = '' + fs.readFileSync(filename);
        return JSON.parse(buffer) as RallyPlan;
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

export const readFileWithoutAdminToken = (planId: string) => {
    const rallyPlan = readFile(planId);
    if (!rallyPlan) {
        return undefined;
    }
    rallyPlan.adminToken = undefined;
    return rallyPlan;
};

export const deleteFile = (planId: string) => {
    fs.unlinkSync(getFilename(planId));
};

export const ensurePlansDirectoryExists = () => {
    if (!fs.existsSync(PLANS_DIRECTORY)) {
        fs.mkdirSync(PLANS_DIRECTORY);
    }
};
/*
Datei schreiben: Admin Token drin haben, und dann vergleichen können
Datei lesen können und das AdminToken raus strippen
Damit sollte eine reine Dateiablage gut funktionieren :)
 */
