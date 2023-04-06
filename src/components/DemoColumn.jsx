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

        /** 设置颜色 */
        //color: ['#1ca9e6', '#f88c24'],

        /** 设置间距 */
        // marginRatio: 0.1,
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
                // 柱形图数据标签位置自动调整
                {
                    type: 'interval-adjust-position',
                }, // 数据标签防遮挡
                {
                    type: 'interval-hide-overlap',
                }, // 数据标签文颜色自动调整
                {
                    type: 'adjust-color',
                },
            ],
        },
    };
    return <Column {...config} />;
};

export default DemoColumn
