// pages/customers/create.js

import { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Admin from "../../layouts/Admin.js";
import Header from "../../components/Headers/Header.js";
import { getDirBackend } from '../../variables/contantes.js';

const AtributoNovo = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage('');

    try {
      const res = await fetch(`${getDirBackend}api/atributos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getHeaderAutorization()
        },
        body: JSON.stringify(formData),
      });
      if (res.status === 201) {
        Router.push('/atributos/');
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

      <form onSubmit={onSubmit}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            placeholder="e.g. John"
            ref={register({ required: 'Nome is required' })}
          />
          {errors.nome && (
            <span role="alert" className="error">
              {errors.nome.message}
            </span>
          )}
        </div>

        <div className="submit">
          <button type="submit" className="createButton">
            Novo
          </button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className="errorMessage">
          {errorMessage}
        </p>
      )}
    </>
  );
};

AtributoNovo.layout = Admin;

export default AtributoNovo;
