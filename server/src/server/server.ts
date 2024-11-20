import express from 'express';
import { configurePlanEndpoints } from '../plans/plansEndpoints';
import { ensurePlansDirectoryExists } from './persistence';

async function main() {
    const app = express();
    ensurePlansDirectoryExists();
    configurePlanEndpoints(app);
}

try {
    main();
} catch (e) {
    console.error(e);
}
