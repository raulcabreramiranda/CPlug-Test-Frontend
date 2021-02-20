import React from "react";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// reactstrap components
import {
  NavLink,
  Nav,
  Card,
  CardHeader,
  CardFooter,
  Media,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import Admin from "../../layouts/Admin.js";
import Header from "../../components/Headers/Header.js";
import Link from 'next/link'; 
import { getDirBackend, getHeaderAutorization } from "../../variables/contantes.js";

const Produto = ({data}) => {

  const deleteEntity = (estoque) => {
    MySwal.fire({
      title: "Confirm delete operation",
      html: "Are you sure you want to delete this Supply",
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#e70015',
      cancelButtonText: (
        <>
          Cancel
        </>
      ),
      confirmButtonText: (
        <> Delete </>
      ),
    }).then(async response => {
      if (response.isConfirmed) {

        const res = await fetch(`${getDirBackend}api/estoques/${estoque.id}`, {
          method: 'DELETE',
          headers: getHeaderAutorization(),
        });        
        MySwal.fire({
          title: "Confirmed delete operation",
          icon: 'success',
        }).then(() => { 
            location.reload();
        });
      }
    });
  }

  return (
    <>
      <Header />
      <Container className="mt-7" fluid>
        <div className="col">
          <Nav className="justify-content-end" pills>
          </Nav>
        </div>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Entrada e saida de Estoque</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Tipo Movimento</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                {data && data.data ? (
                data.data.map((estoque) => (
                        <tr>
                        <td> {dataAtualFormatada(estoque.data)} </td> 
                          <td>
                              <Media>
                                <span className="mb-0 text-sm">
                                  {estoque.tipo_movimento}
                                </span>
                              </Media>
                          </td>
               
                          <td>
                            {console.info(estoque['produto_variacao']['atributo_valores'] )}
                            <div className="d-flex align-items-center">                                
                              {estoque['produto_variacao'] && estoque['produto_variacao']['produto'] 
                              ? estoque['produto_variacao']['produto']['nome']
                            : ""}
                            </div>
                            <div className="avatar-group">
                              {estoque['produto_variacao'] && estoque['produto_variacao']['atributo_valores'] ? estoque['produto_variacao']['atributo_valores'].map((v, i)=>
                                  <span style={{border: "1px solid", margin: "2px", padding: "2px", textAlign: "center"}} key={i} color="alert">{v.valor}</span>
                                ) : <></>}
                            </div>
                          </td>
                        <td> {(estoque.quantidade).toFixed(0).replace('.', ',')} </td> 
                        </tr>
                ))
                ) : (
            <>
  
            </>
          )}
          </tbody>
              </Table>
              <CardFooter className="py-4">
                
              </CardFooter>
            </Card>
          </div>
        </Row>
        </Container>
    </>
  );
}

const dataAtualFormatada = (dataString) => {
  var data = new Date(dataString),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return diaF+"/"+mesF+"/"+anoF;
}

export async function getServerSideProps(context) {
  const res = await fetch(`${getDirBackend}api/estoques`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });

  const data = await res.json();
  if (!data) return { notFound: true };
  if (data.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }


  const resAtributos = await fetch(`${getDirBackend}api/atributos`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });
  const dataAtributos = await resAtributos.json();
  if (!dataAtributos) return { notFound: true };
  if (dataAtributos.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }


  return {
    props: {data, listaAtributos: dataAtributos.data, notFound: false}, // will be passed to the page component as props
  }
}

Produto.layout = Admin;

export default Produto;
