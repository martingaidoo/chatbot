const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')


// Importa el módulo 'fs' para manipular el sistema de archivos (opcional, solo si lo necesitas)
const fs = require('fs');
function sumarDiasAFecha(cantidadDias) {
    const fechaActual = new Date();
    const nuevaFecha = new Date();
    
    nuevaFecha.setDate(fechaActual.getDate() + cantidadDias);

    const nuevaFechaFormateada = `${('0' + nuevaFecha.getDate()).slice(-2)}/${('0' + (nuevaFecha.getMonth() + 1)).slice(-2)}/${nuevaFecha.getFullYear()}`;

    return nuevaFechaFormateada;
}

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowPedirHora = addKeyword(['1/2/2024', '2/2/2024','1/2/2024', '3/2/2024','4/2/2024', '5/2/2024','6/2/2024', '7/2/2024','8/2/2024', '9/2/2024','10/2/2024', '11/2/2024','12/2/2024']).addAnswer(['📄 Aquí tenemos el flujo secundario'])


const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])


const flowPedir = addKeyword(['pedir', 'Pedir']).addAnswer(
    [
        '📄 Puedes elegir una fecha para tu turno',
        'manda un mensaje con el siguiente formato "00/00/24"',
        'dia/mes/año',
        sumarDiasAFecha(0),
        sumarDiasAFecha(1),
        sumarDiasAFecha(2),
        sumarDiasAFecha(3),
        sumarDiasAFecha(4),
        sumarDiasAFecha(5),
        sumarDiasAFecha(6),
        sumarDiasAFecha(7),
        sumarDiasAFecha(8),
        sumarDiasAFecha(9),
        sumarDiasAFecha(10),
        sumarDiasAFecha(11),
    ],
    null,
    null,
    [flowPedirHora]
)
/** 
*const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
*    [
*        '🙌 Aquí encontras un ejemplo rapido',
*        'https://bot-whatsapp.netlify.app/docs/example/',
*        '\n*2* Para siguiente paso.',
*    ],
*    null,
*    null,
*    [flowSecundario]
*)
*/
const flowCancelar = addKeyword(['cancelar', 'Cancelar']).addAnswer(
    [
        '🚀 Puedes cancelar tu turno solo necesito tu documento:'
    ],
    null,
    null,
    [flowSecundario]
)

const flowConsultar = addKeyword(['consultar', "Consultar"]).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'Que es lo que quieres realizar:',
            '👉 *pedir* para pedir un turno',
            '👉 *cancelar*  para cancelar un turno',
            '👉 *consultar* para enviar un mendaje privado a el peluquero',
        ],
        null,
        null,
        [flowPedir, flowCancelar, flowConsultar]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(WebWhatsappProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
