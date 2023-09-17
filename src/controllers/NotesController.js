const knex = require("../database/knex");
const AppError = require("../utils/AppError")

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    if (rating < 1 || rating > 5) {
      throw new AppError("A nota deve estar entre 1 e 5.");
    }

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    })

    await knex("movie_tags").insert(tagsInsert);

    response.status(201).json({message: "Nota cadastrada com sucesso."})
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ note_id: id }).orderBy("name");
    
    return response.json({...note, tags});
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    response.json({ message: "Nota deletada com sucesso." })
  }

  async index(request, response) {
    const { user_id } = request.query;

    const notes = await knex("movie_notes")
    .where({ user_id })
    .orderBy("title");

    return response.json(notes);
  }
}

module.exports = NotesController;
