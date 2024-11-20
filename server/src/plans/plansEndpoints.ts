import { Express, json, urlencoded } from 'express';
import { createFile, deleteFile, readFile, readFileWithoutAdminToken, updateFile } from '../server/persistence';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { RallyPlan } from '../types';

function setHeaders(res: any) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
}

function getPlanId(req: any) {
    const planId = req.params.id;
    if (isValidUUID(planId)) {
        return planId;
    }
    console.error('No uuid as plan id provided');
    throw new Error('No uuid as plan id provided');
}

function getPlanWithoutPassword(plan: RallyPlan) {
    plan.data.backend.planningPassword = undefined;
    return plan;
}

export const configurePlanEndpoints = (app: Express) => {
    console.log('server code');
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.use((_, res, next) => {
        setHeaders(res);
        next();
    });

    // "Admin" list all plannings
    // app.get('/plan', async (req: any, res) => {
    //     try {
    //         res.header('Access-Control-Allow-Origin', '*');
    //         res.header('Access-Control-Allow-Methods', '*');
    //         res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    //
    //         console.log('Get request triggered');
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).end();
    //     }
    // });

    app.get('/plan/:id', async (req: any, res) => {
        try {
            setHeaders(res);

            const plan = readFileWithoutAdminToken(getPlanId(req));
            if (!plan) {
                return res.status(404).end();
            }
            res.json(getPlanWithoutPassword(plan)).end();
        } catch (error) {
            console.error(error);
            return res.status(404).end();
        }
    });

    app.post('/plan', async (req: any, res) => {
        try {
            setHeaders(res);

            const planId = uuidv4();
            const plan = req.body;
            createFile(planId, plan);
            res.json(planId).end();
        } catch (error) {
            console.error(error);
            return res.status(404).end();
        }
    });

    app.put('/plan/:id', async (req: any, res) => {
        try {
            setHeaders(res);
            updateFile(getPlanId(req), req.body);
            return res.status(201).end();
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    });

    app.delete('/plan/:id/:adminToken', async (req: any, res) => {
        try {
            setHeaders(res);
            const planId = getPlanId(req);
            const rallyPlan = readFile(planId);
            if (
                planId &&
                rallyPlan?.adminToken &&
                req.params.adminToken &&
                rallyPlan.adminToken === req.params.adminToken
            ) {
                deleteFile(planId);
                return res.status(204).end();
            } else {
                return res.status(401).end();
            }
        } catch (error) {
            console.error(error);
            return res.status(500).end();
        }
    });

    app.options('*', async (_, res) => {
        setHeaders(res);
        res.status(200).end();
    });

    // Catch all handler for all other request.
    app.use('*', async (req, res) => {
        setHeaders(res);

        res.status(404);
        res.json({ msg: `no route handler found, ${req.baseUrl}` }).end();
    });

    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`index.js listening on ${port}`);
    });
};
