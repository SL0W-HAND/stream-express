const request = require('supertest')
const config = require('../dist/config/index')
const app = require('../dist/app')


var token = ''
describe('User Routes', () => {    
    test("POST /signin", async () => {
        const password = config.default.user.password
        const res = await request(app).post("/signin").send({ password:password})

        token = res.header['set-cookie'][0].split(';')[0].split('=')[1]

        expect(res.statusCode).toEqual(200)
        expect(res.body.auth).toEqual(true) 
        
    });
    
    test("GET Refresh token", async () => {
        const res = await request(app).get("/refresh_token").set('Cookie', 'token='+token)

        token = res.header['set-cookie'][0].split(';')[0].split('=')[1]
        
        expect(res.statusCode).toEqual(200)
    });
});  

describe("Video Routes", () => {
    test("GET videos/:page", async () => {
        const res = await request(app).get("/videos/1").set('Cookie', 'token='+token)

        expect(res.statusCode).toEqual(200)
    })

    test("GET video/:id/data", async () => {
        const res = await request(app).get("/video/1/data").set('Cookie', 'token='+token)

        expect(res.statusCode).toEqual(200)
    })

    test("GET video/:id", async () => {
        const res = await request(app).get("/video/1").set('Cookie', 'token='+token)

        expect(res.statusCode).toEqual(200)
    })

    test("GET video/:id/poster", async () => {
        const res = await request(app).get("/video/1/poster").set('Cookie', 'token='+token)

        expect(res.statusCode).toEqual(200)
    })

    test("GET video/search/:query", async () => {
        const res = await request(app).get("/videos/search/some").set('Cookie', 'token='+token)

        expect(res.statusCode).toEqual(200)
    })

   
});

describe("Req withouth token", () => {
    test("GET videos/:page", async () => {
        const res = await request(app).get("/videos/1")

        expect(res.statusCode).toEqual(401)
    })

    test("GET video/:id/data", async () => {
        const res = await request(app).get("/video/1/data")

        expect(res.statusCode).toEqual(401)
    })

    test("GET video/:id", async () => {
        const res = await request(app).get("/video/1")

        expect(res.statusCode).toEqual(401)
    })

    test("GET video/:id/poster", async () => {
        const res = await request(app).get("/video/1/poster")

        expect(res.statusCode).toEqual(401)
    })

    test("GET video/search/:query", async () => {
        const res = await request(app).get("/videos/search/some")

        expect(res.statusCode).toEqual(401)
    })
});