// Creando nuestro Propio servidor con lo mínimo necesario para hacer PRUEBAS.
// IMPORTANTE: debe ser lo más parecido al servidor donde esta nuestro código que va a ser testeado.

const express = require('express');
const morgan = require('morgan');
const { createServer } = require('http');
const request = require('request'); // depreciado - alternativas https://github.com/request/request/issues/3143
const requestPromise = require('request-promise-native');
const axios = require('axios').default;

const Pins = require('./models/Pins');
const routerPins = require('./routes/pins');


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', routerPins.router);



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
        });

        it('llamar a recurso /api/:id esperando 500', done => {
            // SIMULAR LLAMADA A MÉTODO 'findById' DE MONGOOSE

            // spyOn        intercepta con un espia a la funcion, simulado es esa función
            // and          accede a la estrategia por defecto y devuelve un SpyStrategy
            // callFake     devuelve una function con la misma definicion del método para poder manipularla
            spyOn(Pins, 'findById').and.callFake((id, callback) => {
                callback(true, null);
            })

            request.get('http://localhost:3000/api/1001', (error, response, body) => {
                expect(response.statusCode).toBe(500);
                done();
            })
        });


    });


    describe('Testing POST', () => {

        it('llamar a recurso /api/ esperando 200', done => {

            spyOn(Pins, 'create').and.callFake((pinFake, callback) => {
                callback(false, {})
            });

            spyOn(requestPromise, 'get').and.returnValue(
                Promise.resolve('<title>Platzi</title><meta name="description" content="Platzi reglas">')
            );

            const requestPost = {
                title: 'Titulo',
                author: 'Autor',
                description: 'Esta es una descripción',
                assets: [{ url: 'http://platzi.com' }]
            };

            // llamada POST con request
            request.post('http://localhost:3000/api/', { json: requestPost }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });

            // llamada POST con axios
            // axios.post('http://localhost:3000/api/', requestPost).then(data => {
            //     expect(data.status).toBe(200);
            //     done();
            // })

        });


        it('llamar a recurso /api/ flujo cuando la url es un .pdf o .png esperando 200', done => {

            spyOn(Pins, 'create').and.callFake((pinFake, callback) => {
                callback(false, {})
            });

            spyOn(requestPromise, 'get').and.returnValue(
                Promise.resolve('<title>Platzi</title><meta name="description" content="Platzi reglas">')
            );

            const requestPost = {
                title: 'Titulo',
                author: 'Autor',
                description: 'Esta es una descripción',
                assets: [{ url: 'http://image.pdf' }]
            };

            request.post('http://localhost:3000/api/', { json: requestPost }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            })

        })


        it('llamar a recurso /api/ flujo cuando la url es un .pdf o .png esperando 500', done => {

            spyOn(Pins, 'create').and.callFake((pinFake, callback) => {
                callback(true, null);
            });

            request.post('http://localhost:3000/api/', { json: { assets: [] } }, (error, response, body) => {
                expect(response.statusCode).toBe(500);
                done();
            })
        });


        it('llamar a recurso /api/ flujo cuando la url es un .pdf o .png esperando 463', done => {

            spyOn(Pins, 'create').and.callFake((pinFake, callback) => {
                callback(false, {});
            });

            request.post('http://localhost:3000/api/', { json: { assets: [{ url: 'http://prueba.com' }] } }, (error, response, body) => {
                expect(response.statusCode).toBe(463);
                done();
            });
        });

    });


    describe('Testing PUT', () => {

        it('llamar a recurso /api/:id esperando 200', done => {

            spyOn(Pins, 'findByIdAndUpdate').and.callFake((id, body, callback) => {
                callback(false, {});
            });

            request.put('http://localhost:3000/api/1005', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });

        });

        it('llamar a recurso /api/:id esperando 500', done => {

            spyOn(Pins, 'findByIdAndUpdate').and.callFake((id, body, callback) => {
                callback(true, null);
            });

            request.put('http://localhost:3000/api/1005', (error, response, body) => {
                expect(response.statusCode).toBe(500);
                done();
            });

        });


    });


    describe('Testing DELETE', () => {

        it('llamar a recurso /api/:id esperando 200', done => {

            spyOn(Pins, 'findByIdAndRemove').and.callFake((id, body, callback) => {
                callback(false, {});
            });

            request.delete('http://localhost:3000/api/1006', (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            });

        });

        it('llamar a recurso /api/:id esperando 500', done => {

            spyOn(Pins, 'findByIdAndRemove').and.callFake((id, body, callback) => {
                callback(true, null);
            });

            request.delete('http://localhost:3000/api/1006', (error, response, body) => {
                expect(response.statusCode).toBe(500);
                done();
            });

        });

    });

})


