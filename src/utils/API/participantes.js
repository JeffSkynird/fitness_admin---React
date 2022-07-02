import { encriptarJson, desencriptarJson } from '../security'
import { ENTRYPOINT, LARAVEL_SGI } from '../../config/API'
const axios = require('axios');
export const editar = (id, data, store,carga) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;


    let url = ENTRYPOINT + "participants/" + id;
    let setting = {
        method: "PUT",
        url: url,
        params: data,
        data: data,
        body: data,
        headers: { Accept: "application/json", Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token, },
    };
    mostrarLoader(true);

    axios(setting)
        .then((res) => {
            let response = res.data;
            if (response.type != "error") {

                mostrarLoader(false);
                mostrarNotificacion({ type: "success", message: response.message });
                carga()
            } else {
                mostrarNotificacion({ type: "error", message: response.message });
                mostrarLoader(false);
            }
        })
        .catch((error) => {
            mostrarLoader(false);

            mostrarNotificacion({ type: "error", message: error.message });
        });
};
export const eliminar = (id, store) => {
    const { usuario, cargarUsuario, mostrarNotificacion, mostrarLoader } = store;

    let url = ENTRYPOINT + "participants/" + id;

    let setting = {
        method: "DELETE",
        url: url,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token,

        }
    };
    mostrarLoader(true);

    axios(setting)
        .then((res) => {
            let response = res.data
            if (res.data.type != "error") {
                mostrarLoader(false);
                mostrarNotificacion({ type: "success", message: response.message });
            } else {

                mostrarLoader(false);
                mostrarNotificacion({ type: "error", message: response.message });
            }

        })
        .catch((error) => {
            mostrarLoader(false);
            mostrarNotificacion({ type: "success", message: error.message });
        });
};
export const registrar = (data, store,carga) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;

    let url = ENTRYPOINT + "participants";
    let setting = {
        method: "POST",
        url: url,
        data: data,
        body: data,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token,
        },
    };
    mostrarLoader(true);

    axios(setting)
        .then((res) => {
            let response = res.data;
            if (response.type != "error") {

                mostrarLoader(false);
                mostrarNotificacion({ type: "success", message: response.message });
                carga()
            } else {
                mostrarNotificacion({ type: "error", message: response.message });
                mostrarLoader(false);
            }
        })
        .catch((error) => {
            mostrarLoader(false);

            mostrarNotificacion({ type: "error", message: error.message });
        });
}
export const guardarPuntos = (data, store,confirmado) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;

    let url = ENTRYPOINT + "save_points";
    let setting = {
        method: "POST",
        url: url,
        data: data,
        body: data,
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token,
        },
    };
    mostrarLoader(true);

    axios(setting)
        .then((res) => {
            let response = res.data;
            if (response.type != "error") {

                mostrarLoader(false);
                mostrarNotificacion({ type: "success", message: response.message });
                confirmado()
            } else {
                mostrarNotificacion({ type: "error", message: response.message });
                mostrarLoader(false);
            }
        })
        .catch((error) => {
            mostrarLoader(false);

            mostrarNotificacion({ type: "error", message: error.message });
        });
}

const formater = (data) => {
    let array = [];	
    data.map((e,i)=>{
        let temp = {
            id: e.id,
            num:i+1,
            firstName: e.people.names,
            lastName: e.people.last_names,
            fullname: e.people.names + " " + e.people.last_names,
            categoria:e.categories.name,
            box: e.boxes.name.toUpperCase(),
            total:Number(e.total_score)
        }
        e.points.map((p,i)=>{
            temp["score"+p.step_id] = Number(p.score)
            temp["rank"+p.step_id] = p.position
            temp["value"+p.step_id] = p.value
        })
        array.push(temp);
    })
    return array
}
export const obtenerTodosMonitoreo = (setData,setData2,filter,isFinal) => {

  
    let url = ENTRYPOINT + "participants"
    let setting = {
        method: "Get",
        url: url,

        params:{
            category_id:filter,
            is_final:isFinal
        },
        headers: { 'Accept': 'application/json' }

    };


    axios(setting)
        .then((res) => {
            let response = res.data
            if (response.type != "error") {

               let temp = formater(response.data)
               console.log("DATOS")
               console.log(temp)
                setData(temp)
                setData2(temp)

            } else {

            }
        })
        .catch((error) => {



        });
}
export const obtenerTodos = (setData,store) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;
    let url = ENTRYPOINT + "participants_admin"
    let setting = {
        method: "Get",
        url: url,
        headers: { 'Accept': 'application/json',
        Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token, }

    };

    mostrarLoader(true);
    axios(setting)
        .then((res) => {
            let response = res.data
            if (response.type != "error") {

                setData(response.data)
                mostrarLoader(false);

            } else {

            }
        })
        .catch((error) => {
            mostrarLoader(false);

        });
}
export const obtenerTodosPor = (setData,store,fil) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;
    let url = ENTRYPOINT + "participants_admin"
    let setting = {
        method: "Get",
        url: url,
        params:fil,
        headers: { 'Accept': 'application/json',
        Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token, }

    };

    mostrarLoader(true);
    axios(setting)
        .then((res) => {
            let response = res.data
            if (response.type != "error") {

                setData(response.data)

                mostrarLoader(false);
            } else {

            }
        })
        .catch((error) => {
            mostrarLoader(false);


        });
}
const formateador= (data) => {
    let ar = []
    data.map((e)=>{
        ar.push({
            ...e,
            box: e.boxes.name.toUpperCase(),
            score:e.points.length!=0?e.points[0].score:null,
            position:e.points.length!=0?e.points[0].position:null,
            value:e.points.length!=0?e.points[0].value:null,
            point_id:e.points.length!=0?e.points[0].id:null,
        })

    })
    return ar

}

export const obtenerTodosPorEvento = (data,id,setData,store) => {
    const { usuario, mostrarNotificacion, mostrarLoader } = store;
    let url = ENTRYPOINT + "participants_by_event/"+id
    let setting = {
        method: "Get",
        url: url,
        params:data,
        headers: { 'Accept': 'application/json',
        Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token, }

    };

    mostrarLoader(true);
    axios(setting)
        .then((res) => {
            let response = res.data
            if (response.type != "error") {
                setData(formateador(response.data))
                mostrarLoader(false);
            } else {

            }
        })
        .catch((error) => {
            mostrarLoader(false);


        });
}
export const obtenerSistemaEvaluaciones = (setLabels, setValues, store) => {
    const { usuario, cargarUsuario, mostrarNotificacion, mostrarLoader } = store;


    let url = ENTRYPOINT + "systems_evaluations"
    let setting = {
        method: "Get",
        url: url,
        headers: {
            'Accept': 'application/json',
            Authorization: "Bearer " + JSON.parse(desencriptarJson(usuario)).token,
        }

    };


    axios(setting)
        .then((res) => {
            let response = res.data
            if (response.type != "error") {
                setLabels(response.data.system)
                setValues(response.data.count)


            } else {

            }
        })
        .catch((error) => {



        });
}
