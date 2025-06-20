const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hola desde el backend!'));
app.listen(3001, () => console.log('Backend corriendo en puerto 3001'));
