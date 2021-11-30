// pages/index.tsx
import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link'

interface HomePageProps {
  products: [{
    id: string,
    title: string,
  }]
};

function HomePage({ products }: HomePageProps) {

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}


export async function getStaticProps(context) {
  // node가 부른 것이므로 위치는 프로젝트 전체이다.
  console.log('(Re-)Generating...');
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData.toString());

  if (!data) {
    return {
      redirect
        : {
        destination: '/no-data'
      }
    }
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}

export default HomePage;