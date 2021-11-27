let myToken = '';

function test_getToken() {
    // Use APIKEY
    let apikey = document.getElementById("apikey").value;
    if(!apikey) { myAlert("Por favor ingrese su APIKEY"); return };

    // Invoke routine
    let result = $.ajax({
        url: '/getToken',
        type: 'get',
        data: { apikey: apikey }
    }).done( (data) => {
        if(data.success) {
            myToken = data.result;
            logResult(myToken);
            myAlert('Token obtenido exitosamente');
        } else {
            myAlert('Error al ejecutar la rutina del servidor: '+data.message);
        }
    }).fail( () => {
        myAlert('Error al invocar la rutina del servidor')
    });
}

function test_getBuyerInformation() {
    // Check if token exists
    if(!myToken) { myAlert("Por favor ejecute primero 'obtener token'"); return };

    // Invoke routine
    let result = $.ajax({
        url: '/getBuyerInformation',
        type: 'get',
        data: { token: myToken }
    }).done( (data) => {
        if(data.success) {
            logResult(JSONtoHtml(data.result));
            myAlert('Información obtenida exitosamente');
        } else {
            myAlert('Error al ejecutar la rutina del servidor: '+data.message);
        }
    }).fail( () => {
        myAlert('Error al invocar la rutina del servidor')
    });
}

function test_getSellersInformation() {
    // Check if token exists
    if(!myToken) { myAlert("Por favor ejecute primero 'obtener token'"); return };

    // Invoke routine
    let result = $.ajax({
        url: '/getSellersInformation',
        type: 'get',
        data: { token: myToken }
    }).done( (data) => {
        if(data.success) {
            logResult(JSONtoHtml(data.result));
            myAlert('Información obtenida exitosamente');
        } else {
            myAlert('Error al ejecutar la rutina del servidor: '+data.message);
        }
    }).fail( () => {
        myAlert('Error al invocar la rutina del servidor')
    });
}

function test_getProgrammedDocuments() {
    // Check if token exists
    if(!myToken) { myAlert("Por favor ejecute primero 'obtener token'"); return };

    // Invoke routine
    let result = $.ajax({
        url: '/getProgrammedDocuments',
        type: 'get',
        data: { token: myToken }
    }).done( (data) => {
        if(data.success) {
            logResult(JSONtoHtml(data.result));
            myAlert('Información obtenida exitosamente');
        } else {
            myAlert('Error al ejecutar la rutina del servidor: '+data.message);
        }
    }).fail( () => {
        myAlert('Error al invocar la rutina del servidor')
    });
}

function test_getAdvanceRequestedDocuments() {
    // Check if token exists
    if(!myToken) { myAlert("Por favor ejecute primero 'obtener token'"); return };

    // Invoke routine
    let result = $.ajax({
        url: '/getAdvanceRequestedDocuments',
        type: 'get',
        data: { token: myToken }
    }).done( (data) => {
        if(data.success) {
            logResult(JSONtoHtml(data.result));
            myAlert('Información obtenida exitosamente');
        } else {
            myAlert('Error al ejecutar la rutina del servidor: '+data.message);
        }
    }).fail( () => {
        myAlert('Error al invocar la rutina del servidor')
    });
}

function myAlert(aMessage) {
    Swal.fire({
        text: aMessage,
        icon: 'info',
    });    
}

function logResult(aResult) {
    $("#results").html(aResult);
}

function JSONtoHtml(aJSON) {
    return '<div style="text-align: left"><pre>'+JSON.stringify(aJSON, null, 6)
     .replace(/\n( *)/g, function (match, p1) {
         return '<br>' + '&nbsp;'.repeat(p1.length);
     })+'</pre></div>';
}