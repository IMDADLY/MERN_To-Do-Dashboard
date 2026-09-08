import { useLocation, useParams, useNavigate } from "react-router";
import { useState } from "react";
import { Radio } from "react-loader-spinner";
import axiosPrivate from "../../api/axiosPrivate";
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
    setIsLoading(true);
    await axiosPrivate.post("/api/todos", {
      title,
      description,
      isCompleted,
    });
    navigate("/todos");
    setIsLoading(false);
  };
  const updateItem = async (toDo) => {
    const id = params.id;
    const { title, description, isCompleted } = toDo;
    setIsLoading(true);
    await axiosPrivate.put(`/api/todos/${id}`, {
      title,
      description,
      isCompleted,
    });
    navigate("/todos");
    setIsLoading(false);
  };
  const deleteItem = async () => {
    setIsLoading(false);
    const id = params.id;
    await axiosPrivate.delete(`/api/todos/${id}`);
    navigate("/todos");
    setIsLoading(false);
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
              disabled={readOnly || method == "POST"}
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
