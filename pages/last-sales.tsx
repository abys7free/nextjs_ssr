import { useEffect, useState } from "react";
import useSWR from 'swr';
import axios from 'axios';

interface TransformedSaleType {
  id: string,
  username: string,
  volume: number
}


interface LastSalesPageProps {
  sales: {
    username: string
    volume: number
  }
}


const LastSalesPage: React.FC<LastSalesPageProps> = (props) => {
  const initialFormedSales: TransformedSaleType[] = [];
  for (const key in props.sales) {
    initialFormedSales.push({
      id: key,
      username: props.sales[key].username,
      volume: props.sales[key].volume,
    });
  }
  const [sales, setSales] = useState<TransformedSaleType[]>(initialFormedSales);
  // const [isLoading, setIsLoading] = useState(false);
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(
    'https://nextjs-study-58580-default-rtdb.firebaseio.com/sales.json'
    , fetcher);
  useEffect(() => {
    if (data) {
      const transformedSales: TransformedSaleType[] = [];
      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data])

  if (error) {
    return <p>Failed to load.</p>
  }

  if (!data && !sales) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {sales.map((sale) => <li key={sale.id}>{sale.username} - ${sale.volume}</li>)}
    </ul>
  )
}

export async function getStaticProps() {
  const response = await fetch('https://nextjs-study-58580-default-rtdb.firebaseio.com/sales.json'
  )
  const data = await response.json()
  const transformedSales: TransformedSaleType[] = [];
  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }
  // revalidate: 10
  return { props: { sales: transformedSales } };
};

export default LastSalesPage;