import React, { useState } from "react";
import Router from "next/router";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import { getDirBackend, setCookie } from "../../variables/contantes";

function Login() {

  const [email, setEmail] = useState('raul1@gmail.com');
  const [senha, setSenha] = useState('123456');

  const handleSubmit = () => {

    try {
      const res = fetch(`${getDirBackend}api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({email, senha}),
        }
      ).then(async res=>{
        if (res.status === 200) {
          const data = await res.json()          
          setCookie('HEADERS_AUTORIZATION', data.token, 1);
          Router.push("/atributos/");
        } else {
          res.text().then(v=>console.error(v));
        }
      })
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">        
          <CardBody className="px-lg-5 py-lg-5">
            <h1 className="text-center text-muted mb-4">
              Autenticar
            </h1>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={v=>setEmail(v.target.value)}
                    type="email"
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    value={senha}
                    onChange={v=>setSenha(v.target.value)}
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" onClick={()=>handleSubmit()}>
                  Entrar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

Login.layout = Auth;

export default Login;
