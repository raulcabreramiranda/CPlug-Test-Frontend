// pages/customers/create.js

import { useState } from "react";
import Router from "next/router";
import { useForm } from "react-hook-form";

import { getDirBackend, getHeaderAutorization } from "../../../variables/contantes.js";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

import {
  NavItem,
  NavLink,
  Nav,
  Col,
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
  Button,
  Table,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
} from "reactstrap";
import Admin from "../../../layouts/Admin.js";
import Header from "../../../components/Headers/Header.js";

const AtributoEditar = (data) => {
  const atributo = data ? data.data : null;

  const [atributoValorEditar, setAtributoValorEditar] = useState(null);
  const [atributoNome, setAtributoNome] = useState(atributo.nome);

  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage("");

    try {
      const res = await fetch(
        `${getDirBackend}api/atributos/${atributo.id}`,
        {
          method: "PUT",
          headers: {
            ...getHeaderAutorization(),
            "Content-Type": "application/json",            
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.status === 200) {
        if (data.token_invalid === true) Router.push("/auth/login");
        Router.push(`/atributos`);
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  const onSubmitAtributo = async (formData) => {
    if (errorMessage) setErrorMessage("");

    try {
      const res = await fetch(
        `${getDirBackend}api/atributo_valores${formData.id ? "/"+formData.id : ""}`,
        {
          method: formData.id ? "PUT" : "POST",
          headers: {
            ...getHeaderAutorization(),
            "Content-Type": "application/json",       
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.status === 200) {
        if (data.token_invalid === true) Router.push("/auth/login");
        location.reload()
      } else {
        // throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const renderNewModal = () => {
    if(atributoValorEditar === null) return null;
    return (
      <Modal
        size={"lg"}
        isOpen={atributoValorEditar !== null}
        toggle={() => setAtributoValorEditar(null)}
      >
        <ModalHeader toggle={() => setAtributoValorEditar(null)}>
          { atributoValorEditar.id === null ? "Novo Valor": "Editar Valor" }
        </ModalHeader>
        <div>
          <ModalBody>
            <div>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label" htmlFor="input-email">
                      Nome{" "}
                    </label>
                    <Input
                      className="form-control-alternative"
                      id="atributo-nome"
                      placeholder=""
                      value={
                        atributoValorEditar && atributoValorEditar.valor
                          ? atributoValorEditar.valor
                          : ""
                      }
                      onChange={(v) =>
                        setAtributoValorEditar({
                          ...atributoValorEditar,
                          valor: v.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>

              {errors.nome && (
                <span role="alert" className="error">
                  {errors.nome.message}
                </span>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => setAtributoValorEditar(null)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={(v) =>
                onSubmitAtributo({
                  id: atributoValorEditar.id,
                  valor: atributoValorEditar.valor,
                  atributo: { id: atributo.id },
                })
              }
            >
              Editar
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    );
  };

  const deleteEntity = (atributoValor) => {
    MySwal.fire({
      title: "Confirm delete operation",
      html: "Are you sure you want to delete this Supply",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#e70015",
      cancelButtonText: <>Cancel</>,
      confirmButtonText: <> Delete </>,
    }).then(async (response) => {
      if (response.isConfirmed) {
        const res = await fetch(
          `${getDirBackend}api/atributo_valores/${atributoValor.id}`,
          {
            method: "DELETE",
            headers: getHeaderAutorization(),
          }
        );
        MySwal.fire({
          title: "Confirmed delete operation",
          icon: "success",
        }).then(() => {
          location.reload();
        });
      }
    });
  };

  return (
    <>
      <Header />

      <Container className="mt-7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Editando Atributo</h3>
              </CardHeader>
              {renderNewModal()}
              <form onSubmit={onSubmit}>
                <Col lg="12">
                  <Row>
                    <Col className="text-right" lg="12">
                      <Button
                        type="submit"
                        right
                        color="primary"
                        className="createButton"
                      >
                        Salvar
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Nome
                        </label>
                        <Input
                          className="form-control-alternative"
                          name="nome"
                          id="atributo-nome"
                          placeholder=""
                          value={atributoNome}
                          onChange={(v) => setAtributoNome(v.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </form>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Atributos</th>
                    <th scope="col">
                      <div className="col text-right">
                    
                        <Button
                          color="primary"
                          onClick={() => setAtributoValorEditar({
                            id: null,
                            valor: ""
                          })}
                        >
                          Novo
                        </Button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {atributo && atributo["atributos_valores"] ? (
                    atributo["atributos_valores"].map((atributoValores, i) => (
                      <tr key={i}>
                        <td scope="row">
                          <Media>
                            <span className="mb-0 text-sm">
                              {atributoValores.valor}
                            </span>
                          </Media>
                        </td>
                        <td scope="row"></td>
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
                              <DropdownItem
                                onClick={(e) =>
                                  setAtributoValorEditar(atributoValores)
                                }
                              >
                                Editar
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => deleteEntity(atributoValores)}
                              >
                                Apagar
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      {errorMessage && (
        <p role="alert" className="errorMessage">
          {errorMessage}
        </p>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(
    `${getDirBackend}api/atributos/${context.params.id}`,
    {
      method: "GET",
      headers: getHeaderAutorization(context),
    }
  );

  const data = await res.json();
  if (!data) return { notFound: true };
  if (data.token_invalid === true)
    return { redirect: { destination: "/auth/login", permanent: false } };

  return {
    props: { data: data.data, notFound: false }, // will be passed to the page component as props
  };
}

AtributoEditar.layout = Admin;

export default AtributoEditar;
