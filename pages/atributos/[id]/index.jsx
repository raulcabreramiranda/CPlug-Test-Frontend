import { useRouter } from 'next/router';
import useSWR from 'swr';
import Admin from "../../../layouts/Admin.js";
// core components
import Header from "../../../components/Headers/Header.js";
import { getDirBackend, getHeaderAutorization } from '../../../variables/contantes.js';

const Atributo = (data) => {
  const atributo = data ? data.data : null ;
  return (
    <>

      <Header />
      <h1>Atributo</h1>
      <hr />
      {atributo ? (
        <div>
          <p className="name">
            {atributo.nome}
          </p>
          <p className="num">{atributo.codigo}</p>
          <p className="num">{atributo.preco}</p>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(`${getDirBackend}api/atributos/${context.params.id}`, {
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


Atributo.layout = Admin;

export default Atributo;