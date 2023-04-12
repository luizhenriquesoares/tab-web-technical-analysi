import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

type PriceData = {
  describe: {
    id: number;
    date: string;
    lastPrice: number;
    asset: string;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    variation: string;
    dateIndex: number;
  };
  sma50: {
    value: number[];
  };
};

type HomeProps = {
  priceData: PriceData;
};

const Home: React.FC<HomeProps> = ({ priceData }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    console.log(priceData, 'here')
    if (priceData && priceData.sma50 && priceData.sma50.value) {
      setChartData({
        labels: priceData.sma50.value.map((_, index) => `Dia ${index + 1}`),
        datasets: [
          {
            label: 'SMA 50',
            data: priceData.sma50.value,
            backgroundColor: ['rgba(75, 192, 192, 0.6)'],
            borderWidth: 4,
          },
        ],
      });
    }
  }, [priceData]);
  
  if (!priceData || !priceData.sma50) {
    return <div>Dados não disponíveis</div>;
  }

  return (
    <div>
      <h1>Média Móvel Simples (SMA 50)</h1>
      <Line data={chartData} />
    </div>
  );
};


export async function getServerSideProps() {
  const response = await axios.get('http://127.0.0.1:3001/v1/technical-analysis?asset=BTC&period=01/01/2019');
  return { props: { priceData: response.data } };
}

export default Home;
