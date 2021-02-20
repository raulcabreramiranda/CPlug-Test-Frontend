import React from "react";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// reactstrap components
import {
  Alert,
  NavLink,
  Nav,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
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

  const deleteEntity = (produto) => {
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

        const res = await fetch(`${getDirBackend}api/produtos/${produto.id}`, {
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
            <Link href={`/produtos/novo`} as={`/produtos/novo`}>
              <NavLink
                className={"py-2 px-3 active"}
                href="#pablo"
              >
                <span className="d-none d-md-block">Novo</span>
              </NavLink>
            </Link>
          </Nav>
        </div>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de Produtos</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Codigo</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Atributos</th>
                    <th scope="col">Nome</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {data && data.data ? (
                data.data.map((produto) => (
                        <tr>
                          <td scope="row">
                            <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  src={require("assets/img/theme/bootstrap.jpg")}
                                />
                              </a>
                              <Media>
                                <span className="mb-0 text-sm">
                                  {produto.nome}
                                </span>
                              </Media>
                            </Media>
                          </td>  
                          <td>
                              <Media>
                                <span className="mb-0 text-sm">
                                  {produto.codigo}
                                </span>
                              </Media>
                          </td>
                          <td> R$ {(produto.preco).toFixed(2).replace('.', ',')} </td>                        
                          <td>
                            <div className="avatar-group">
                              {produto.atributos ? produto.atributos.map((v, i)=>
                                  <span style={{border: "1px solid", margin: "2px", padding: "2px", textAlign: "center"}} key={i} color="alert">{v.nome}</span>
                                ) : <></>}
                            </div>
                          </td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-arrow" right>
                                <Link href={`/produtos/${produto.id}/editar`} as={`/produtos/${produto.id}/editar`}>
                                  <DropdownItem>
                                    Editar
                                  </DropdownItem>
                                </Link>
                                <DropdownItem
                                  href="#pablo"
                                  onClick={(e) => deleteEntity(produto)}
                                >
                                  Apagar
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
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

export async function getServerSideProps(context) {
  const res = await fetch(`${getDirBackend}api/produtos`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });

  const data = await res.json();
  if (!data) return { notFound: true };
  if (data.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }

  return {
    props: {data, notFound: false}, // will be passed to the page component as props
  }
}

Produto.layout = Admin;

export default Produto;
