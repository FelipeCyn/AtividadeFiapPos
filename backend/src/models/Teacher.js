import pool from '../config/database.js'
import bcrypt from 'bcryptjs'

class Teacher {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM teachers WHERE email = $1',
      [email]
    )
    return result.rows[0]
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, nome, email, created_at FROM teachers WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  static async create(nome, email, password) {
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    const result = await pool.query(
      'INSERT INTO teachers (nome, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at',
      [nome, email, password_hash]
    )
    return result.rows[0]
  }

  static async validatePassword(password, password_hash) {
    return bcrypt.compare(password, password_hash)
  }
}

export default Teacher
