import React, { useEffect, useRef, useState } from "react";
import { DualAxes, Line } from "@ant-design/plots";
import { Button, DatePicker, FloatButton, message, Select, Space } from "antd";
import DemoColumn from "./DemoColumn";
import DemoTable from "./DemoTable";
import {
  BarChartOutlined,
  FundOutlined,
  LineChartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";


export const DemoLine = () => {
  const [data, setData] = useState([]);
  const [TConfig, setTConfig] = useState([
    {
      isShow: true,
      label: "line",
    },
    {
      isShow: false,
      label: "pillar",
    },
    {
      isShow: false,
      label: "table",
    },
  ]);
  const [data2, setData2] = useState([]);
  const [area, setArea] = useState("Hokkaido");
  const [labelName, setLabelName] = useCallbackState([]);
  const [nda_values, setnda_values] = useCallbackState(["0"]);
  const [dateRange, setDateRange] = useState([]);
  const [areaConfig, setAreaConfig] = useState([
    { label: "Hokkaido", value: "Hokkaido" },
    { label: "Tokyo", value: "Tokyo" },
    { label: "Chubu", value: "Chubu" },
    { label: "Kansai", value: "Kansai" },
    { label: "Chugoku", value: "Chugoku" },
    { label: "Shikoku", value: "Shikoku" },
    { label: "Kyushu", value: "Kyushu" },
  ]);

  const plainOptions = [
    { label: "price", value: "price" },
    { label: "demand", value: "demand" },
    { label: "load", value: "load" },
  ];

  const config2 = {
    data: [data, data2],
    xField: "year",
    yField: ["val1", "val2"],
    xAxis: {
      type: "time",
    },
    geometryOptions: [
      {
        geometry: "line",
        seriesField: "category",
        lineStyle: {
          lineWidth: 3,
          lineDash: [5, 5],
        },
        smooth: true,
      },
      {
        geometry: "line",
        seriesField: "category",
        point: {},
      },
    ],
  };

  function asyncTest(test) {
    let list = [];

    if (labelName.length === 2) {
      const filteredData = test.filter((obj) => obj.hasOwnProperty("AvgPrice"));
      const filteredData2 = test.filter((obj) =>
        obj.hasOwnProperty("AvgDemand")
      );
      const filteredData3 = test.filter((obj) => obj.hasOwnProperty("Load"));
      if (labelName.includes("price")) {
        if (labelName.includes("demand")) {
          //price-demand
            let l1 = filteredData.map((d, i) => ({
              year: new Date(d.DateTime * 1000),
              val1: d.AvgPrice,
              category: d.Area + "_price",
              index: i + d.AvgPrice + d.Area,
            }));
          let l2 = filteredData2.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            val2: d.AvgDemand,
            category: d.Area + "_demand",
            index: i + d.AvgDemand + d.Area,
          }));
          setData(l1);
          setData2(l2);
        } else {
          //price-load
          let l1 = filteredData.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            val1: d.AvgPrice,
            category: d.Area + "_price",
            index: i + d.AvgPrice + d.Area,
          }));
          let l2 = filteredData3.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            val2: d.Load,
            category: d.Area + "_load",
            index: i + d.Load + d.Area,
          }));

          setData(l1);
          setData2(l2);
        }
      } else {
        //demand-load
        let l1 = filteredData2.map((d, i) => ({
          year: new Date(d.DateTime * 1000),
          val1: d.AvgDemand,
          category: d.Area + "_demand",
          index: i + d.AvgDemand + d.Area,
        }));
        let l2 = filteredData3.map((d, i) => ({
          year: new Date(d.DateTime * 1000),
          val2: d.Load,
          category: d.Area + "_load",
          index: i + d.Load + d.Area,
        }));

        setData(l1);
        setData2(l2);
      }
    } else {
      labelName.map((it) => {
        if (it == "price") {
          const filteredData = test.filter((obj) =>
            obj.hasOwnProperty("AvgPrice")
          );

          let p = filteredData.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            value: d.AvgPrice,
            category: d.Area + "_price",
            index: i + d.AvgPrice + d.Area + "_price" + i,
          }));
          list = [...list, ...p];
        }
        if (it == "demand") {
          const filteredData2 = test.filter((obj) =>
            obj.hasOwnProperty("AvgDemand")
          );

          let p = filteredData2.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            value: d.AvgDemand,
            category: d.Area + "_demand",
            index: i + d.AvgDemand + d.Area + "_demand" + i,
          }));
          list = [...list, ...p];
          console.log(p, "demand");
        }
        if (it === "load") {
          const filteredData3 = test.filter((obj) =>
            obj.hasOwnProperty("Load")
          );

          let p = filteredData3.map((d, i) => ({
            year: new Date(d.DateTime * 1000),
            value: d.Load,
            category: d.Area + "_load",
            index: i + d.Load + d.Area + d.Area + "_demand" + i,
          }));
          list = [...list, ...p];
        }
      });
      setData(list);
    }
  }

  const getList = () => {
    asyncFetch();
    // asyncTest(test);
  };

  const asyncFetch = () => {
    const startDate =
      dateRange && dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : null;
    const endDate =
      dateRange && dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : null;
    const apiUrl = `http://127.0.0.1:5000/api/data?StartDate=${startDate}&EndDate=${endDate}&area=${area}&status=${labelName}&nda_values=${nda_values}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((test) => {
        asyncTest(test);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  const handleDateRangeChange = (dateRange) => {
    setDateRange(dateRange);
  };

  const config = {
    data,
    xField: "year",
    yField: "value",
    seriesField: "category",
    xAxis: {
      type: "time",
    },
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setData([]);
      setData2([]);
      if (labelName.length === 3) {
      } else {
        labelName.map((it) => {
          console.log(it);
          if (it === " price") {
            setAreaConfig([
              { label: "Hokkaido", value: "Hokkaido" },
              { label: "Tokyo", value: "Tokyo" },
              { label: "Chubu", value: "Chubu" },
              { label: "Kansai", value: "Kansai" },
              { label: "Chugoku", value: "Chugoku" },
              { label: "Shikoku", value: "Shikoku" },
              { label: "Kyushu", value: "Kyushu" },
            ]);
          }
          if (it === "demand") {
            setAreaConfig([
              { label: "Hokkaido", value: "Hokkaido" },
              {
                label: "Tohoku",
                value: "Tohoku",
              },
              { label: "Tokyo", value: "Tokyo" },
              { label: "Chubu", value: "Chubu" },
              {
                label: "Hokuriku",
                value: "Hokuriku",
              },
              { label: "Kansai", value: "Kansai" },
              {
                label: "Chugoku",
                value: "Chugoku",
              },
              { label: "Shikoku", value: "Shikoku" },
              { label: "Kyushu", value: "Kyushu" },
            ]);
          }
        });
      }
    }
    return () => {
      ignore = true;
    };
  }, [labelName.length]);

  function useCallbackState(od) {
    const cbRef = useRef();
    const [data, setData] = useState(od);

    useEffect(() => {
      cbRef.current && cbRef.current(data);
    }, [data]);

    return [
      data,
      function (d, callback) {
        cbRef.current = callback;
        setData(d);
      },
    ];
  }

  const onChangeCheck = (checkedValues) => {
    console.log(checkedValues);
    if (labelName.length < 2) {
      setLabelName(checkedValues);
    } else {
      if (checkedValues.length < 2) {
        setLabelName(checkedValues);
      } else {
        message.info("Select up to 2");
      }
    }

    // chooseLeave(checkedValues)
  };

  const handleChange = (value) => {
    // chooseLeave(value)
    setArea(value);
  };

  const LineCommon = () => {
    if (labelName.length === 2) {
      return <DualAxes {...config2}></DualAxes>;
    } else {
      return <Line {...config} />;
    }
  };

  const nadConfig = [
    {
      label: "Forecast-Latest",
      value: "0",
    },
    {
      label: "Forecast-DA",
      value: "1",
    },
    {
      label: "Forecast-2DA",
      value: "2",
    },
  ];

  const changeShow = (label) => {
    let list = [];
    TConfig.map((it) => {
      if (it.label === label) {
        list.push({
          ...it,
          isShow: !it.isShow,
        });
      } else {
        list.push(it);
      }
    });
    console.log(list);
    setTConfig(list);
  };

  return (
    <>
      <Space>
        <DatePicker.RangePicker onChange={handleDateRangeChange} />
        <Select
          mode="multiple"
          allowClear
          defaultValue={["Hokkaido"]}
          placeholder="Please select"
          onChange={handleChange}
          options={areaConfig}
          style={{ width: "300px" }}
        />
        <Select
          mode="multiple"
          allowClear
          defaultValue={["price"]}
          value={labelName}
          placeholder="Please select"
          onChange={onChangeCheck}
          options={plainOptions}
          style={{ width: "200px" }}
        />

        {labelName.includes("load") ? (
          <Select
            mode="multiple"
            allowClear
            value={nda_values}
            defaultValue={[1]}
            placeholder="Please select"
            onChange={(val) => setnda_values(val)}
            options={nadConfig}
            style={{ width: "200px" }}
          />
        ) : (
          <></>
        )}

        <Button onClick={getList}>Load</Button>
      </Space>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        {TConfig.map((it, i) => {
          if (it.label === "line" && it.isShow) {
            return <LineCommon style={{ width: "100%",marginBottom: 20  }} key={i}></LineCommon>;
          }
          if (it.label === "pillar" && it.isShow) {
            return (
              <DemoColumn
                style={{ width: "100%",marginBottom: 20 }}
                key={i}
                data1={data}
                data2={data2}
              />
            );
          }
          if (it.label === "table" && it.isShow) {
            return (
              <DemoTable
                style={{ width: "100%",marginBottom: 20  }}
                key={i}
                data={data}
                data2={data2}
              />
            );
          }
        })}
      </Space>

      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{
          right: 24,
        }}
        icon={<UnorderedListOutlined />}
      >
        <FloatButton
          type={TConfig[0].isShow ? "primary" : ""}
          onClick={() => changeShow("line")}
          icon={<LineChartOutlined />}
        />
        <FloatButton
          type={TConfig[1].isShow ? "primary" : ""}
          onClick={() => changeShow("pillar")}
          icon={<BarChartOutlined />}
        />
        <FloatButton
          type={TConfig[2].isShow ? "primary" : ""}
          onClick={() => changeShow("table")}
          icon={<FundOutlined />}
        />
      </FloatButton.Group>
      {/*<Checkbox.Group options={plainOptions} defaultValue={labelName} onChange={onChangeCheck} />*/}
    </>
  );
};
