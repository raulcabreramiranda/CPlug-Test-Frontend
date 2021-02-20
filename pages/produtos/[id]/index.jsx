import { useRouter } from 'next/router';
import useSWR from 'swr';
import Admin from "../../../layouts/Admin.js";
// core components
import Header from "../../../components/Headers/Header.js";
import { getDirBackend, getHeaderAutorization } from '../../../variables/contantes.js';

const Produto = (data) => {
  const produto = data ? data.data : null ;
  return (
    <>

      <Header />
      <h1>Produto</h1>
      <hr />
      {produto ? (
        <div>
          <p className="name">
            {produto.nome}
          </p>
          <p className="num">{produto.codigo}</p>
          <p className="num">{produto.preco}</p>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(`${getDirBackend}api/produtos/${context.params.id}`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });

  const data = await res.json();
  if (!data) return { notFound: true };
  if (data.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }

  return {
    props: {data:data.data, notFound: false}, // will be passed to the page component as props
  }
}


Produto.layout = Admin;

export default Produto;