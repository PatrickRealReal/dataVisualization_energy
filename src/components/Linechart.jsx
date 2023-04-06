import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { DatePicker } from 'antd';


export const DemoLine = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, [dateRange]);

  const asyncFetch = () => {
    const startDate = dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
    const endDate = dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;
    const apiUrl = `http://127.0.0.1:5000/api/data?StartDate=${startDate}&EndDate=${endDate}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        // Extract required fields and format date
        const formattedData = json.map((d) => ({
          year: new Date(d.DateTime * 1000),
          value: d.AvgPrice,
          category: d.Area,
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  return (
    <>
      <DatePicker.RangePicker onChange={handleDateRangeChange} />
      <Line {...config} />
    </>
  );
};
