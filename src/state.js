import axios from "axios"

export const getTodos = () => axios.get("/api/todos").then(({ data }) => data)

export const createTodo = (text) =>
  axios.post("/api/todos", { text }).then(({ data }) => data)

export const deleteTodo = (id) =>
  axios.delete(`/api/todos/${id}`).then(({ data }) => data)
