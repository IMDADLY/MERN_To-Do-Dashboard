import { useLocation, useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Radio } from "react-loader-spinner";
import axios from "axios";
const BASE_URL = "http://localhost:3000/api/todos/";
const REFRESH_URL = "http://localhost:3000/auth/refresh";
type Todo = {
  title: string;
  description: string;
  isCompleted: boolean;
};
type method = "POST" | "UPDATE" | "DELETE";
const Item = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const noErrors = {
    title: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const { title, description, isCompleted } = location.state;
  const [toDo, setToDo] = useState<Todo>({ title, description, isCompleted });
  const [errors, setErrors] = useState(noErrors);
  const method: method = location?.state?.method;
  const postItem = async (toDo) => {
    const { title, description, isCompleted } = toDo;
    try {
      setIsLoading(true);
      await axios.post(
        BASE_URL,
        {
          title,
          description,
          isCompleted,
        },
        { withCredentials: true },
      );
      navigate("/todos");
    } catch (err) {
      const errMessage = err.response?.data.message;
      if (errMessage === "401_UNAUTHORIZED" || errMessage === "TOKEN_EXPIRED") {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        await axios.post(
          BASE_URL,
          { title, description, isCompleted },
          { withCredentials: true },
        );
        navigate("/todos");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const updateItem = async (toDo) => {
    const id = params.id;
    const { title, description, isCompleted } = toDo;
    try {
      setIsLoading(true);
      await axios.put(
        BASE_URL + id,
        {
          title,
          description,
          isCompleted,
        },
        { withCredentials: true },
      );
      navigate("/todos");
    } catch (err) {
      const errMessage = err.response?.data.message;
      if (errMessage === "401_UNAUTHORIZED" || errMessage === "TOKEN_EXPIRED") {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        await axios.post(BASE_URL + id, { ...toDo }, { withCredentials: true });
        navigate("/todos");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const deleteItem = async () => {
    try {
      setIsLoading(false);
      const id = params.id;
      await axios.delete(BASE_URL + id, { withCredentials: true });
      navigate("/todos");
    } catch (err) {
      const errMessage = err.response?.data.message;
      if (errMessage === "401_UNAUTHORIZED" || errMessage === "TOKEN_EXPIRED") {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        await axios.delete(BASE_URL, { withCredentials: true });
        navigate("/todos");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (method === "POST") {
      const errs = validate();
      if (!errs) {
        postItem(toDo);
      }
    } else if (method === "UPDATE") {
      const errs = validate();
      if (!errs) {
        updateItem(toDo);
      }
    } else if (method === "DELETE") {
      deleteItem();
    }
  };
  const validate = () => {
    const { title } = toDo;
    const newErrors = {
      title: title.trim().length < 1 ? "Title is required" : "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err.length > 0);
    return hasErrors;
  };
  const readOnly = method === "DELETE" ? true : false;
  return (
    <>
      <Radio
        visible={isLoading}
        height="50"
        width="50"
        colors={["green", "green", "green"]}
        ariaLabel="radio-loading"
      />
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <h2>To Do</h2>
          <hr></hr>
          <label>
            Title
            <input
              readOnly={readOnly}
              type="text"
              name="user"
              id="user"
              value={toDo.title}
              className="m-8 rounded border-gray-300 shadow-sm sm:text-sm"
              onChange={(e) => setToDo({ ...toDo, title: e.target.value })}
            />
            {errors.title && (
              <span className="text-red-400 text-xs p-2">{errors.title}</span>
            )}
          </label>
          <label>
            Description
            <input
              readOnly={readOnly}
              type="text"
              name="description"
              id="description"
              value={toDo.description}
              onChange={(e) =>
                setToDo({ ...toDo, description: e.target.value })
              }
            />
          </label>
          <label>
            Completed
            <input
              readOnly={readOnly}
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              defaultChecked={isCompleted}
              onChange={(e) =>
                setToDo({ ...toDo, isCompleted: e.target.checked })
              }
            />
          </label>
          <button type="submit" className="bg-blue-500 rounded-xs p-2 m-4">
            Submit
          </button>
        </form>
      )}
    </>
  );
};
export default Item;
