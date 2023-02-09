import request from 'supertest';
import { server } from '../server.js'

test('1+1=2', ()=>{
    expect(1+1).toBe(2);
});

test('Should return a response code of 200', async () => {
    const response = await request("http://localhost:8080").get("/healthz");
    expect(response.statusCode).toBe(200);
    server.close();
});
