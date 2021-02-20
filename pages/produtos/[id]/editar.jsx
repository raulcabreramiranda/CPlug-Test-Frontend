// pages/customers/create.js

import { useState } from 'react';
import Router from 'next/router';
import Admin from "../../../layouts/Admin.js";
import Header from "../../../components/Headers/Header.js";
import Select from 'react-select';
import { getDirBackend, getHeaderAutorization } from '../../../variables/contantes.js';

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

const ProdutoEditar = (props) => {
  const produto = props ? props.data : null ;


  const [atributosSelect, setAtributosSelect] = useState(
    !produto.atributos ? [] : produto.atributos.map(v=>({value:v.id, label:v.nome}))
  );
  const [produtoVariacaoEditar, setProdutoVariacaoEditar] = useState(null);
  const [produtoNome, setProdutoNome] = useState(produto.nome);
  const [produtoCodigo, setProdutoCodigo] = useState(produto.codigo);
  const [produtoPreco, setProdutoPreco] = useState(produto.preco);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (errorMessage) setErrorMessage('');

    try {
      const res = await fetch(`${getDirBackend}api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaderAutorization(),
        },
        body: JSON.stringify({
          "nome": produtoNome,
          "codigo": produtoCodigo,
          "preco": produtoPreco,
          "atributos": atributosSelect.map(v=>({id: v.value})),
        }),
      });
      if (res.status === 200) {
        location.reload();
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

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
    if(produtoVariacaoEditar === null) return null;
    return (
      <Modal
        size={"lg"}
        isOpen={produtoVariacaoEditar !== null}
        toggle={() => setProdutoVariacaoEditar(null)}
      >
        <ModalHeader toggle={() => setProdutoVariacaoEditar(null)}>
          { produtoVariacaoEditar.id === null ? "Novo Valor": "Editar Valor" }
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
                      id="produto-nome"
                      placeholder=""
                      value={
                        produtoVariacaoEditar && produtoVariacaoEditar.valor
                          ? produtoVariacaoEditar.valor
                          : ""
                      }
                      onChange={(v) =>
                        setProdutoVariacaoEditar({
                          ...produtoVariacaoEditar,
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
              onClick={() => setProdutoVariacaoEditar(null)}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={(v) =>
                onSubmitAtributo({
                  id: produtoVariacaoEditar.id,
                  produto: { id: produto.id },
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
    <Header/>
      <Container className="mt-7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Editar Produto</h3>
              </CardHeader>
              {renderNewModal()}

      <div >
        <Col lg="12">
          <Row>
            <Col className="text-right" lg="12">
              <Button
                type="submit"
                right
                color="primary"
                className="createButton"
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="5">
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
                  value={produtoNome}
                  onChange={v=>setProdutoNome(v.target.value)}             
                />
              </FormGroup>
            </Col>
            <Col lg="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  Codigo
                </label>
                <Input
                  className="form-control-alternative"
                  name="codigo"
                  value={produtoCodigo}
                  onChange={v=>setProdutoCodigo(v.target.value)} 
                />
              </FormGroup>
            </Col>
            <Col lg="3">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  Preço
                </label>
                <Input
                  className="form-control-alternative"                  
                  name="preco"
                  value={produtoPreco}
                  onChange={v=>setProdutoPreco(v.target.value)}
                />
              </FormGroup>
            </Col>
            <Col lg="12">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  Atributos
                </label>
                    <Select
                      id="atributos"
                      isMulti
                      className={'css-select-control'}
                      value={ atributosSelect }
                      options={props.listaAtributos.map(v=>({value:v.id, label:v.nome}))}
                      onChange={(options) => setAtributosSelect(options)}
                      name="atributos"
                    />
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </div>


            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(`${getDirBackend}api/produtos/${context.params.id}`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });

  const resAtributos = await fetch(`${getDirBackend}api/atributos`, {
    method: 'GET',
    headers: getHeaderAutorization(context),
  });
  const dataAtributos = await resAtributos.json();
  if (!dataAtributos) return { notFound: true };
  if (dataAtributos.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }

  const data = await res.json();
  if (!data) return { notFound: true };
  if (data.token_invalid === true) return { redirect: { destination: '/auth/login', permanent: false } }


  return {
    props: {data: data.data, listaAtributos: dataAtributos.data, notFound: false}
  }
}

ProdutoEditar.layout = Admin;

export default ProdutoEditar;
