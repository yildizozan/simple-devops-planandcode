const express = require('express')
const app = express()
const PORT = 8081;

app.get('/:project/:list/:card/:process', function(request, response) {
    console.log("Yeni builde gelen kart bilgisi alındı!", request.params);
    console.log("*******************************************");
    
})

app.get('/:org/:project/:status', function(request, response) {
    console.log("Proje!", request.params);
    console.log("*******************************************");
})

app.listen(PORT, () => console.log('Mule listening on port ' + PORT))