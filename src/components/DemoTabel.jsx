import {Table} from "antd";
import React, {useState} from "react";


function format (time){
    const date = new Date(time);
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)

    return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}
const DemoTabel = ({data,data2}) => {
    const [columns, setcolumns] = useState([
        {
            title: 'year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'category',
            dataIndex: 'category',
            key: 'category',
        },])
    let datas = [];
    data.map(it => {
        datas.push({
            ...it,
            year: format(it.year),
            value:it.value ? it.value : (it.val1 ? it.val1 :it.val2)
        })
    })
    data2.map(it => {
        datas.push({
            ...it,
            year: format(it.year),
            value:it.value ? it.value : (it.val1 ? it.val1 :it.val2)
        })
    })
    console.log(datas)
    // setcolumns([
    //     {
    //         title: 'year',
    //         dataIndex: 'year',
    //         key: 'year',
    //     },
    //     {
    //         title: 'value',
    //         dataIndex: 'value',
    //         key: 'value',
    //     },
    //     {
    //         title: 'category',
    //         dataIndex: 'category',
    //         key: 'category',
    //     },
    // ])

    return (
        <>
            <Table pagination={false} dataSource={datas} columns={columns}
                   rowKey={record => record.index}/>
        </>
    )
}

export default DemoTabel
