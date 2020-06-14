const express = require('express');
const morgan = require('morgan');
const { createServer } = require('http');
const Pins = require('./models/Pins');
const apiRouter = require('./routes/pins').router;
const request = require('request'); // depreciado - alternativas https://github.com/request/request/issues/3143

const app = express();

app.use(morgan('dev'));
app.use('/api', apiRouter);



describe('Testing Router', () => {

    let server;

    beforeAll(() => {
        server = createServer(app);
        server.listen(3000);
    });

    afterAll(() => {
        server.close();
    });


    describe('Testing GET', () => {

        it('Llama a recurso /api al método raíz esperando 200', done => {

            // SIMULAR LLAMADA A MÉTODO 'find' DE MONGOOSE

            // spyOn        intercepta con un espia a la funcion, simulado es esa función
            // and          accede a la estrategia por defecto y devuelve un SpyStrategy
            // callFake     devuelve una function con la misma definicion del método para poder manipularla
            spyOn(Pins, 'find').and.callFake(callbackFromFind => {

                // => callbackFromFind
                // function(err, pins) {
                //     if (err) return next(err);
                //     res.json(pins);
                // }

                const pinsFake = [{ id: 1 }];
                callbackFromFind(false, pinsFake);
            });


            request.get('http://localhost:3000/api/', (error, response, bodyI) => {
                expect(response.statusCode).toBe(200);
                expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);

                done(); // detener asincronismo
            })
        });


        it('Llama a recurso /api/ esperando 500', done => {

            // SIMULAR LLAMADA A MÉTODO 'find' DE MONGOOSE

            // spyOn        intercepta con un espia a la funcion, simulado es esa función
            // and          accede a la estrategia por defecto y devuelve un SpyStrategy
            // callFake     devuelve una function con la misma definicion del método para poder manipularla
            spyOn(Pins, 'find').and.callFake(callback => {
                callback(true, null);
            });

            request.get('http://localhost:3000/api/', (error, response, body) => {
                expect(response.statusCode).toBe(500);

                done(); // detener asincronismo
            })
        });


        it('llamar a recurso /api/:id esperando 200', done => {
            // SIMULAR LLAMADA A MÉTODO 'findById' DE MONGOOSE

            // spyOn        intercepta con un espia a la funcion, simulado es esa función
            // and          accede a la estrategia por defecto y devuelve un SpyStrategy
            // callFake     devuelve una function con la misma definicion del método para poder manipularla
            spyOn(Pins, 'findById').and.callFake((id, callback) => {
                const pinsFake = [{ id: 1 }];
                callback(false, pinsFake);
            })

            request.get('http://localhost:3000/api/1001', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            })

        })


    });


    describe('Testing POST', () => {

    });



})


