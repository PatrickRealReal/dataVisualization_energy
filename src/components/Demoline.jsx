import React, { useEffect, useRef, useState } from "react";
import { DualAxes, Line } from "@ant-design/plots";
import { Button, DatePicker, FloatButton, message, Select, Space } from "antd";
import DemoColumn from "./DemoColumn";
import DemoTabel from "./DemoTabel";
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
  const [labelName, setLabelName] = useCallbackState(["price"]);
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
        seriesField: "category", // ×Ô¼º²é
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
    let test = [
      { Area: "Hokkaido", AvgDemand: 3245.0, DateTime: 1678924800 },
      {
        Area: "Hokkaido",
        AvgDemand: 3367.0,
        DateTime: 1678928400,
      },
      { Area: "Hokkaido", AvgDemand: 3471.0, DateTime: 1678932000 },
      {
        Area: "Hokkaido",
        AvgDemand: 3568.0,
        DateTime: 1678935600,
      },
      { Area: "Hokkaido", AvgDemand: 3645.0, DateTime: 1678939200 },
      {
        Area: "Hokkaido",
        AvgDemand: 3651.0,
        DateTime: 1678942800,
      },
      { Area: "Hokkaido", AvgDemand: 3683.0, DateTime: 1678946400 },
      {
        Area: "Hokkaido",
        AvgDemand: 3684.0,
        DateTime: 1678950000,
      },
      { Area: "Hokkaido", AvgDemand: 3815.0, DateTime: 1678953600 },
      {
        Area: "Hokkaido",
        AvgDemand: 3999.0,
        DateTime: 1678957200,
      },
      { Area: "Hokkaido", AvgDemand: 3992.0, DateTime: 1678960800 },
      {
        Area: "Hokkaido",
        AvgDemand: 4010.0,
        DateTime: 1678964400,
      },
      { Area: "Hokkaido", AvgDemand: 3876.0, DateTime: 1678968000 },
      {
        Area: "Hokkaido",
        AvgDemand: 4074.0,
        DateTime: 1678971600,
      },
      { Area: "Hokkaido", AvgDemand: 4042.0, DateTime: 1678975200 },
      {
        Area: "Hokkaido",
        AvgDemand: 3967.0,
        DateTime: 1678978800,
      },
      { Area: "Hokkaido", AvgDemand: 3862.0, DateTime: 1678982400 },
      {
        Area: "Hokkaido",
        AvgDemand: 3887.0,
        DateTime: 1678986000,
      },
      { Area: "Hokkaido", AvgDemand: 4004.0, DateTime: 1678989600 },
      {
        Area: "Hokkaido",
        AvgDemand: 3870.0,
        DateTime: 1678993200,
      },
      { Area: "Hokkaido", AvgDemand: 3718.0, DateTime: 1678996800 },
      {
        Area: "Hokkaido",
        AvgDemand: 3583.0,
        DateTime: 1679000400,
      },
      { Area: "Hokkaido", AvgDemand: 3454.0, DateTime: 1679004000 },
      {
        Area: "Hokkaido",
        AvgDemand: 3473.0,
        DateTime: 1679007600,
      },
      { Area: "Hokkaido", AvgDemand: 3411.0, DateTime: 1679011200 },
      {
        Area: "Hokkaido",
        AvgDemand: 3476.0,
        DateTime: 1679014800,
      },
      { Area: "Hokkaido", AvgDemand: 3620.0, DateTime: 1679018400 },
      {
        Area: "Hokkaido",
        AvgDemand: 3741.0,
        DateTime: 1679022000,
      },
      { Area: "Hokkaido", AvgDemand: 3858.0, DateTime: 1679025600 },
      {
        Area: "Hokkaido",
        AvgDemand: 3814.0,
        DateTime: 1679029200,
      },
      { Area: "Hokkaido", AvgDemand: 3779.0, DateTime: 1679032800 },
      {
        Area: "Hokkaido",
        AvgDemand: 3632.0,
        DateTime: 1679036400,
      },
      { Area: "Hokkaido", AvgDemand: 3652.0, DateTime: 1679040000 },
      {
        Area: "Hokkaido",
        AvgDemand: 3907.0,
        DateTime: 1679043600,
      },
      { Area: "Hokkaido", AvgDemand: 3956.0, DateTime: 1679047200 },
      {
        Area: "Hokkaido",
        AvgDemand: 3911.0,
        DateTime: 1679050800,
      },
      { Area: "Hokkaido", AvgDemand: 3744.0, DateTime: 1679054400 },
      {
        Area: "Hokkaido",
        AvgDemand: 3764.0,
        DateTime: 1679058000,
      },
      { Area: "Hokkaido", AvgDemand: 3725.0, DateTime: 1679061600 },
      {
        Area: "Hokkaido",
        AvgDemand: 3649.0,
        DateTime: 1679065200,
      },
      { Area: "Hokkaido", AvgDemand: 3781.0, DateTime: 1679068800 },
      {
        Area: "Hokkaido",
        AvgDemand: 3875.0,
        DateTime: 1679072400,
      },
      { Area: "Hokkaido", AvgDemand: 3992.0, DateTime: 1679076000 },
      {
        Area: "Hokkaido",
        AvgDemand: 3869.0,
        DateTime: 1679079600,
      },
      { Area: "Hokkaido", AvgDemand: 3698.0, DateTime: 1679083200 },
      {
        Area: "Hokkaido",
        AvgDemand: 3537.0,
        DateTime: 1679086800,
      },
      { Area: "Hokkaido", AvgDemand: 3453.0, DateTime: 1679090400 },
      {
        Area: "Hokkaido",
        AvgDemand: 3479.0,
        DateTime: 1679094000,
      },
      { Area: "Hokkaido", AvgPrice: 10.98, DateTime: 1678924800 },
      {
        Area: "Hokkaido",
        AvgPrice: 10.81,
        DateTime: 1678928400,
      },
      { Area: "Hokkaido", AvgPrice: 11.14, DateTime: 1678932000 },
      {
        Area: "Hokkaido",
        AvgPrice: 11.68,
        DateTime: 1678935600,
      },
      { Area: "Hokkaido", AvgPrice: 11.68, DateTime: 1678939200 },
      {
        Area: "Hokkaido",
        AvgPrice: 11.77,
        DateTime: 1678942800,
      },
      { Area: "Hokkaido", AvgPrice: 12.97, DateTime: 1678946400 },
      {
        Area: "Hokkaido",
        AvgPrice: 11.16,
        DateTime: 1678950000,
      },
      { Area: "Hokkaido", AvgPrice: 12.34, DateTime: 1678953600 },
      {
        Area: "Hokkaido",
        AvgPrice: 4.01,
        DateTime: 1678957200,
      },
      { Area: "Hokkaido", AvgPrice: 1.32, DateTime: 1678960800 },
      {
        Area: "Hokkaido",
        AvgPrice: 1.63,
        DateTime: 1678964400,
      },
      { Area: "Hokkaido", AvgPrice: 1.32, DateTime: 1678968000 },
      {
        Area: "Hokkaido",
        AvgPrice: 8.65,
        DateTime: 1678971600,
      },
      { Area: "Hokkaido", AvgPrice: 11.81, DateTime: 1678975200 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.74,
        DateTime: 1678978800,
      },
      { Area: "Hokkaido", AvgPrice: 12.16, DateTime: 1678982400 },
      {
        Area: "Hokkaido",
        AvgPrice: 13.88,
        DateTime: 1678986000,
      },
      { Area: "Hokkaido", AvgPrice: 16.16, DateTime: 1678989600 },
      {
        Area: "Hokkaido",
        AvgPrice: 14.71,
        DateTime: 1678993200,
      },
      { Area: "Hokkaido", AvgPrice: 13.04, DateTime: 1678996800 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.48,
        DateTime: 1679000400,
      },
      { Area: "Hokkaido", AvgPrice: 11.84, DateTime: 1679004000 },
      {
        Area: "Hokkaido",
        AvgPrice: 10.29,
        DateTime: 1679007600,
      },
      { Area: "Hokkaido", AvgPrice: 12.4, DateTime: 1679011200 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.42,
        DateTime: 1679014800,
      },
      { Area: "Hokkaido", AvgPrice: 12.56, DateTime: 1679018400 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.6,
        DateTime: 1679022000,
      },
      { Area: "Hokkaido", AvgPrice: 12.82, DateTime: 1679025600 },
      {
        Area: "Hokkaido",
        AvgPrice: 13.18,
        DateTime: 1679029200,
      },
      { Area: "Hokkaido", AvgPrice: 11.55, DateTime: 1679032800 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.54,
        DateTime: 1679036400,
      },
      { Area: "Hokkaido", AvgPrice: 7.98, DateTime: 1679040000 },
      {
        Area: "Hokkaido",
        AvgPrice: 5.95,
        DateTime: 1679043600,
      },
      { Area: "Hokkaido", AvgPrice: 1.01, DateTime: 1679047200 },
      {
        Area: "Hokkaido",
        AvgPrice: 0.01,
        DateTime: 1679050800,
      },
      { Area: "Hokkaido", AvgPrice: 0.01, DateTime: 1679054400 },
      {
        Area: "Hokkaido",
        AvgPrice: 0.82,
        DateTime: 1679058000,
      },
      { Area: "Hokkaido", AvgPrice: 3.14, DateTime: 1679061600 },
      {
        Area: "Hokkaido",
        AvgPrice: 7.88,
        DateTime: 1679065200,
      },
      { Area: "Hokkaido", AvgPrice: 13.42, DateTime: 1679068800 },
      {
        Area: "Hokkaido",
        AvgPrice: 14.86,
        DateTime: 1679072400,
      },
      { Area: "Hokkaido", AvgPrice: 16.26, DateTime: 1679076000 },
      {
        Area: "Hokkaido",
        AvgPrice: 15.71,
        DateTime: 1679079600,
      },
      { Area: "Hokkaido", AvgPrice: 14.87, DateTime: 1679083200 },
      {
        Area: "Hokkaido",
        AvgPrice: 14.0,
        DateTime: 1679086800,
      },
      { Area: "Hokkaido", AvgPrice: 13.84, DateTime: 1679090400 },
      {
        Area: "Hokkaido",
        AvgPrice: 12.13,
        DateTime: 1679094000,
      },
      { Area: "temp", AvgPrice: 13.84, DateTime: 1679090400 },
      {
        Area: "temp",
        AvgPrice: 12.13,
        DateTime: 1679094000,
      },
      { Area: "temp", AvgDemand: 13.84, DateTime: 1679090400 },
      {
        Area: "temp",
        AvgPrice: 12.13,
        DateTime: 1679094000,
      },
      { Area: "Hokkaido", Load: 13.84, DateTime: 1679090400 },
      {
        Area: "Hokkaido",
        Load: 12.13,
        DateTime: 1679094000,
      },
      { Area: "temp", Load: 13.84, DateTime: 1679090400 },
      {
        Area: "temp",
        Load: 12.13,
        DateTime: 1679094000,
      },
    ];

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
              <DemoTabel
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
