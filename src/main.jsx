import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Importa o Tailwind
import { RotasApp } from './roteamento/RotasApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RotasApp />
  </React.StrictMode>,
)
/*
PROFESSORES:
- Email: joao.silva@professor.com | Senha: 123456
- Email: maria.santos@professor.com | Senha: 123456

ACADÊMICOS:
- Email: pedro.oliveira@aluno.com | Senha: 123456
- Email: ana.costa@aluno.com | Senha: 123456
- Email: lucas.mendes@aluno.com | Senha: 123456
*/