const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    if(checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }
    
    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return response.status(201).json({message: `Usuário ${name} criado com sucesso!`});
  }

  async update(request, response) {
    const { name, email } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = ?", [id])
    if(!user) {
      throw new AppError("O ID de usuário não foi encontrado.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = ?", [email]);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError("Esse endereço de e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await database.run(
      "UPDATE users SET name = ?, email = ?, updated_at = DATETIME('NOW') WHERE id = ? ", [user.name, user.email, id]
      );
    
    return response.status(200).json({message: `Usuário ID: ${id} atualizado com sucesso.`})
  }

}

module.exports = UsersController;