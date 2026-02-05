import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const db = mysql.createPool({
  host: 'benserverplex.ddns.net',
  user: 'alunos',
  password: 'senhaAlunos',
  database: 'web_03mb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preco, descricao, categoria } = req.body

    if (!nome || !preco || !descricao || !categoria) {
      return res.status(400).json({ 
        erro: 'Todos os campos são obrigatórios'
      })
    }

    const connection = await db.getConnection()
    const query = 'INSERT INTO produtos_luizbarbosa (nome, preco, descricao, categoria) VALUES (?, ?, ?, ?)'
    
    await connection.execute(query, [nome, preco, descricao, categoria])
    connection.release()

    res.status(201).json({ 
      mensagem: 'Produto salvo com sucesso'
    })
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro)
    res.status(500).json({ 
      erro: 'Erro ao salvar o produto no banco de dados'
    })
  }
})

app.get('/api/produtos', async (req, res) => {
  try {
    const connection = await db.getConnection()
    const [produtos] = await connection.execute('SELECT nome, preco, descricao, categoria FROM produtos_luizbarbosa')
    connection.release()

    res.status(200).json(produtos)
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro)
    res.status(500).json({ 
      erro: 'Erro ao buscar produtos do banco de dados'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
