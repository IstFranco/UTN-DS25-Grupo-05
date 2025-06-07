document.addEventListener("DOMContentLoaded", function() {

    //Boton de confirmacion de inicio
    const confirmBtn = document.getElementById('confirmar-filtro');
    const resultado = document.getElementById('resultado');


    confirmBtn.addEventListener('click', function(e) {
        e.preventDefault(); // evita que se recargue la página

        /*const fechaesp=document.getElementById('fecesp');
        const fechaini=document.getElementById('fecini');
        const fechafin=document.getElementById('fecfin');
        const fecrap=document.getElementById('fecrap');*/
        const ciudad=document.getElementById('ciudad').value;
        const barrio=document.getElementById('barrio').value;
        /*const distancia=document.getElementById('distancia');
        const estgetElementByIdeneral=document.getElementById('estgen');
        const tematicaesp=document.getElementById('temesp');
        const musica=document.getElementById('genmus');
        const precio=document.getElementById('tipoprop');
        const pentradagratis=document.getElementById('entgrat');
        const randprecio=document.getElementById('rango');
        const masvotado=document.getElementById('masvot');
        const mascomentado=document.getElementById('mascom');
        const tendencia=document.getElementById('tenact');
        const mejororganizador=document.getElementById('mejororg');
        const entradasdisponibles=document.getElementById('disp');
        const ultimasentradas=document.getElementById('ult'); */

        let errores=[];

        if (ciudad == "Elija la ciudad...") errores.push('Debe seleccionar una ciudad');
        if (barrio == "Elija el barrio...") errores.push('Debe seleccionar un barrio');

        if(errores.length > 0){
            resultado.textContent = errores.join("\n");
        } else {
            resultado.textContent="";
        }
    })

    const filterBtn = document.getElementById('filterBtn');
    const filtersDropdown = document.getElementById('filtersDropdown');

    filterBtn.addEventListener('click', () => {
    filtersDropdown.classList.toggle('hidden');
    // Opcional: cambiar el icono del botón
    if (filtersDropdown.classList.contains('hidden')) {
        filterBtn.textContent = 'Filtrar ▼';
    } else {
        filterBtn.textContent = 'Filtrar ▲';
    }
    });

})