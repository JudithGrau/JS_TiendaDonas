$.ajax({
    method: 'GET',
    url: 'https://reqres.in/api/users'
}).done((data)=> {
    console.log(data);
    crearCards(data);
}).fail((error)=> {
    console.log(error);
}).always(()=> {
    console.log('acción completada');
});


function crearCards(data){
    console.log(data);
    const divUsuarios = $('.list-container');
    $(data).each( function(index, usuario) {
        divUsuarios.append(`
        <li class="card-container m-5" style="width: 20rem; list-style: none">
            <div class="name-container text-center">
                <span class="firstName">${usuario.data['0'].first_name}</span>
            </div>
            <div class="image-container text-center">
                <img class="round rounded-circle"  src="${usuario.data['0'].avatar}">
            </div>
            <p class="text-center">"Me entantaron las donas, son las mejores!"</p>
        </li>
        <li class="card-container m-5" style="width: 20rem; list-style: none">
            <div class="name-container text-center">
                <span class="firstName">${usuario.data['1'].first_name}</span>
            </div>
            <div class="image-container text-center">
                <img class="round rounded-circle"  src="${usuario.data['1'].avatar}">
            </div>
            <p class="text-center">"Muy amables en su atención."</p>
        </li>
        <li class="card-container m-5" style="width: 20rem; list-style: none">
            <div class="name-container text-center">
                <span class="firstName">${usuario.data['2'].first_name}</span>
            </div>
            <div class="image-container text-center">
                <img class="round rounded-circle"  src="${usuario.data['2'].avatar}">
            </div>
            <p class="text-center">"Increíble el relleno de las donas!"</p>
        </li>
        <li class="card-container m-5" style="width: 20rem; list-style: none">
            <div class="name-container text-center">
                <span class="firstName">${usuario.data['3'].first_name}</span>
            </div>
            <div class="image-container text-center">
                <img class="round rounded-circle"  src="${usuario.data['3'].avatar}">
            </div>
            <p class="text-center">"Las pedí por WhatsApp, y en un rato me llegaron a casa."</p>
        </li>

        
        `)
    })
}