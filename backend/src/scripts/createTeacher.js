import Teacher from '../models/Teacher.js'
import pool from '../config/database.js'

async function createTeacher() {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.log('Uso: node src/scripts/createTeacher.js <nome> <email> <senha>')
    console.log('Exemplo: node src/scripts/createTeacher.js "João Silva" "joao@fiap.com.br" "senha123"')
    process.exit(1)
  }

  const [nome, email, password] = args

  try {
    const existingTeacher = await Teacher.findByEmail(email)

    if (existingTeacher) {
      console.error('Erro: Já existe um professor com este email.')
      process.exit(1)
    }

    const teacher = await Teacher.create(nome, email, password)

    console.log('Professor criado com sucesso!')
    console.log(`ID: ${teacher.id}`)
    console.log(`Nome: ${teacher.nome}`)
    console.log(`Email: ${teacher.email}`)

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Erro ao criar professor:', error.message)
    await pool.end()
    process.exit(1)
  }
}

createTeacher()
