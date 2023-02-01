import request from 'supertest';
import express from 'express';

test('1+1=2', ()=>{
    expect(1+1).toBe(2);
});
jest.setTimeout(5000);
test('Should return a response code of 200', async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded());
    app.get('/healthz', (req, res) => {  
        res.status(200).json({ msg: "Succesful access" });
    });

    const port = 8080;
    const server = app.listen(port, () => {
        console.log(`The server runs at ${port}.`);
    });
    const response = await request("http://localhost:8080").get("/healthz");
    expect(response.statusCode).toBe(200);
    server.close();
});
