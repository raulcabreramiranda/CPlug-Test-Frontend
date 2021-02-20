import React from "react";

import { getDirBackend, getHeaderAutorization } from '../../variables/contantes.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// reactstrap components
import {
  NavItem,
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
} from "reactstrap";
import Admin from "../../layouts/Admin.js";
import Header from "../../components/Headers/Header.js";
import Link from 'next/link'; 

const Atributo = ({data}) => {
  const deleteEntity = (atributo) => {
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

        const res = await fetch(`${getDirBackend}api/atributos/${atributo.id}`, {
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
            <Link href={`/atributos/novo`} as={`/atributos/novo`}>
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
                <h3 className="mb-0">Lista de Atributos</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Atributos</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {data && data.data ? (
                data.data.map((atributo, i) => (
                        <tr key={i}>
                          <th scope="row">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {atributo.nome}
                                </span>
                              </Media>
                          </th>  
                          <td>
                              <Media>
                                <span className="mb-0 text-sm">
                                  {atributo.nome}
                                </span>
                              </Media>
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
                                <Link href={`/atributos/${atributo.id}/editar`} as={`/atributos/${atributo.id}/editar`}>
                                  <DropdownItem>
                                    Editar
                                  </DropdownItem>
                                </Link>
                                <DropdownItem
                                  href="#pablo"
                                  onClick={(e) => deleteEntity(atributo)}
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
  const res = await fetch(`${getDirBackend}api/atributos`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });

  
  const data = await res.json();
  if (!data) return { notFound: true }
  if (data.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }

  const resProdutos = await fetch(`${getDirBackend}api/produtos`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });
  const dataProdutos = await resProdutos.json();
  if (!dataProdutos) return { notFound: true };
  if (dataProdutos.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }


  return {
    props: {data, listaProdutos: dataProdutos.data, notFound: false}, // will be passed to the page component as props
  }
}

Atributo.layout = Admin;

export default Atributo;
