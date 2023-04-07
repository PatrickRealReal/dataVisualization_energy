import React from 'react';
import {Column} from '@ant-design/plots';
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
const DemoColumn = ({data1 = [], data2 = []}) => {
    let data = [];

   data1.map(it => {
        data.push({
            ...it,
            year: format(it.year),
            value:it.value ? it.value : (it.val1 ? it.val1 :it.val2)
        })
    })
   data2.map(it => {
       data.push({
           ...it,
           year: format(it.year),
           value:it.value ? it.value : (it.val1 ? it.val1 :it.val2)
       })
    })

    const config = {
        data,
        isGroup: true,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',

        label: {
            position: 'middle',

            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
    };
    return <Column {...config} />;
};

export default DemoColumn
