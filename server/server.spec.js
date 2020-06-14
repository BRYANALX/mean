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

            // 'and' accede a la estrategia por defecto y devuelve un SpyStrategy
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
        

        it('Llama a recurso /api al método raíz esperando 500', done => {

            // SIMULAR LLAMADA A MÉTODO 'find' DE MONGOOSE

            // 'and' accede a la estrategia por defecto y devuelve un SpyStrategy
            spyOn(Pins, 'find').and.callFake(callbackFromFind => {

                // => callbackFromFind
                // function(err, pins) {
                //     if (err) return next(err);
                //     res.json(pins);
                // }

                callbackFromFind(true, null);
            });


            request.get('http://localhost:3000/api/', (error, response, bodyI) => {
                expect(response.statusCode).toBe(500);
                done(); // detener asincronismo
            })


        });


    });



})


