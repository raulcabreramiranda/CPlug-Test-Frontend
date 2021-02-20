// pages/customers/create.js

import { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Admin from "../../layouts/Admin.js";
import Header from "../../components/Headers/Header.js";
import Select from 'react-select';
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
import { getDirBackend } from '../../variables/contantes.js';

const EstoqueNovo = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors } = useForm();

  const [produtoNome, setProdutoNome] = useState(produto.nome);
  const [produtoCodigo, setProdutoCodigo] = useState(produto.codigo);
  const [produtoPreco, setProdutoPreco] = useState(produto.preco);

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage('');

    try {
      const res = await fetch(`${getDirBackend}api/estoques`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaderAutorization()
        },
        body: JSON.stringify(formData),
      });
      if (res.status === 200) {
        Router.push('/');
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <>
    <Header/>
      <h1>Create Customer</h1>
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
    props: {listaProdutos: data.data, listaAtributos: dataAtributos.data, notFound: false}
  }
}

EstoqueNovo.layout = Admin;

export default EstoqueNovo;
