const express = require('express');
const app = express();

app.get(['/api', '/api/'], (req, res) => {
  res.send('Backend funcionando - Pablo!!!!');
});
app.listen(3000, () => console.log('Backend corriendo en puerto 3000'));

