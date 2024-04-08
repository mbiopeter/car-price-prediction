import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ApexChart = () => {
  const [series, setSeries] = useState([{ data: [] }]);
  const [options, setOptions] = useState({
    chart: {
      id: 'chart2',
      type: 'line',
      toolbar: {
        autoSelected: 'pan',
        show: false
      },
      animations: {
        enabled: false
      }
    },
    colors: ['#546E7A'],
    stroke: {
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0
    },
    xaxis: {
      title: {
        text: 'Horsepower'
      }
    },
    yaxis: {
      title: {
        text: 'Price(Dollers)'
      }
    },
    tooltip: {
      enabled: true,
      shared: true, 
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/predict/');
        const data = response.data.map(item => ({ x: item.Horsepower, y: item.Price }));
        const newSeries = [{ data }];
        setSeries(newSeries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh',display: 'flex',flexDirection: 'column'}}>
        <div style={{ height: '10%',display:'flex',alignItems:'center',paddingLeft:'20px',backgroundColor:'blue'}}>
            <span style={{fontSize:'30px',fontWeight:'bold',color:'white'}}>Car Price Pridictions according to HorsePower, Engine_size,Fuel_efficiency and number of sales</span>
        </div>
      <ReactApexChart options={options} series={series} type="line" width="100%" height="90%" />
    </div>
  );
};

export default ApexChart;
