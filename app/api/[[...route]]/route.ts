import { Hono }  from 'hono';
import { handle } from 'hono/vercel';
import { HTTPException } from 'hono/http-exception';

import accounts from './accounts';
import categories from './categories';
import transactions from "./transactions"
import summary from './summary';



export const runtime = "nodejs";


const app = new Hono().basePath('/api');

app.onError((err, c) => {
    if(err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json({
        error: "Internal error"
    }, 500);
})

const routes = app
    .route("/transactions", transactions)
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/summary", summary)

export const GET = handle(app);
export const POST = handle(app) ; 
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;