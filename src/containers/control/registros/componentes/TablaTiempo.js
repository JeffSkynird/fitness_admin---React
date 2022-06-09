import React from 'react'

import { LocalizationTable, TableIcons, removeAccent } from '../../../../utils/table.js'
import MaterialTable from "material-table";
export default function TablaTiempo(props) {
    const { participants, setParticipants ,ordenar} = props;
  return (
    
    <MaterialTable
    icons={TableIcons}
    columns={[
        { defaultSort:"asc",editable: 'never', title: 'RANK',type:"numeric", field: 'position', render: rowData => <span>{rowData.position != null ? rowData.position : "-"}</span> },                                        {
            title: 'Nombres',
            field: 'fullname',
            editable: 'never'

        },
        {
            title: 'Box',
            field: 'boxes', render: rowData => (<span>{rowData.boxes.name}</span>),
            editable: 'never'
        },
        {
            title: 'Total',
            field: 'total_score', render: rowData => (<span>{Number(rowData.total_score)}</span>),
            editable: 'never',hidden:true
        },
        { title: "TIME/REP", field: "value", render: rowData => <span>{rowData.value != null ? rowData.value : "---"}</span> },
        { editable: 'never', title: "Puntos", field: "score", render: rowData => <span>{rowData.score != null ? Number(rowData.score) : "-"}</span> },
    ]}
    cellEditable={{
        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (newValue !== "") {

                        const dataUpdate = [...participants];
                        const index = rowData.tableData.id;
                        if (columnDef.field == "value2") {
                            if (dataUpdate[index].value >= 15) {
                                dataUpdate[index][columnDef.field] = newValue;
                                setParticipants([...dataUpdate]);
                            } else {
                            //    initializer.mostrarNotificacion({ type: "warning", message: 'El tiempo muerto es menor a 15' });
                            }
                        } else {
                            dataUpdate[index][columnDef.field] = newValue;
                            setParticipants([...dataUpdate]);
                        }






                    }
                    resolve();
                }, 500)
            });
        }
    }}

    data={
        participants
    }
    title="Participantes"

    localization={LocalizationTable}
    actions={[{
        icon: TableIcons.ImportExportIcon,
        iconProps: {
            style: {
                color: 'red',
                backgroundColor: 'red',
                fontSize: '20px'
            }
        },
        tooltip: 'Ordenar',
        isFreeAction: true,
        onClick: (event, rowData) => {
            ordenar()
        }
    }]}

    options={{
        pageSize: 10,
        paging: false,
        actionsCellStyle: {
            color:'red'
        },
        actionsColumnIndex: -1,
        width: '100%',
        maxBodyHeight: 400,

        headerStyle: {
            textAlign: 'left'
        },
        cellStyle: {
            textAlign: 'left'
        },
        searchFieldStyle: {

            padding: 5
        }
    }}

/>

  )
}
