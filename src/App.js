import React, { useState } from "react"
import { useQuery, useMutation, queryCache } from "react-query"
import { getTodos, createTodo, deleteTodo } from "./state"
import { useSnackbars } from "./contexts/snackbars"
import { v4 } from "uuid"
import Delete from "@material-ui/icons/Delete"
import {
  makeStyles,
  Container,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(6),
    background: "#f4f4f4",
  },
  headline: {
    textAlign: "center",
    margin: `${theme.spacing(4)}px 0`,
  },
  paper: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))

const App = () => {
  const classes = useStyles()
  const [todoText, setTodoText] = useState("")
  const { showSnackbar } = useSnackbars()

  // get todos
  const { status, data: todos } = useQuery("todos", getTodos)

  // delete todo
  const [deleteMutation] = useMutation(deleteTodo, {
    onMutate: (deletedTodo) => {
      queryCache.cancelQueries("todos") // prevent any ongoing refetches

      const prevTodos = queryCache.getQueryData("todos")
      const nextTodos = prevTodos.filter((todo) => todo._id !== deletedTodo)
      queryCache.setQueryData("todos", nextTodos)

      return () => queryCache.setQueryData("todos", prevTodos)
    },
    onSuccess: () => {
      showSnackbar("Todo deleted", "success")
    },
    onError: (err, deletedTodo, rollback) => {
      showSnackbar("Something went wrong", "error")

      return rollback()
    },
  })

  // create todo
  const [createMutation] = useMutation(createTodo, {
    onMutate: (newTodo) => {
      queryCache.cancelQueries("todos")

      const prevTodos = queryCache.getQueryData("todos")
      const newTodoObj = {
        _id: v4(),
        text: newTodo,
        completed: false,
      }
      queryCache.setQueryData("todos", [newTodoObj, ...prevTodos])

      return () => queryCache.setQueryData("todos", prevTodos)
    },
    onSuccess: () => {
      showSnackbar("Todo added", "success")
    },
    onError: (err, newTodo, rollback) => {
      showSnackbar("Something went wrong", "error")

      return rollback()
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    createMutation(todoText)
    setTodoText("")
  }

  return (
    <Container fixed maxWidth="md" className={classes.container}>
      <Typography variant="h4" className={classes.headline}>
        Todos
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          variant="outlined"
          label="New todo"
        />
        <Button variant="outlined" color="secondary" type="submit">
          Add
        </Button>
      </form>

      {status === "loading" ? (
        <CircularProgress />
      ) : status === "error" ? (
        <p>Something went wrong :(</p>
      ) : (
        todos.map(({ _id, text, completed }) => (
          <Paper key={_id} className={classes.paper}>
            <Typography
              variant="body1"
              style={{ textDecoration: completed ? "line-through" : "none" }}
            >
              {text}
            </Typography>

            <IconButton size="small" onClick={() => deleteMutation(_id)}>
              <Delete />
            </IconButton>
          </Paper>
        ))
      )}
    </Container>
  )
}

export default App
