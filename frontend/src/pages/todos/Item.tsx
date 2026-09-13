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
  const postItem = async (toDo: Todo) => {
    const { title, description, isCompleted } = toDo;
    setIsLoading(true);
    try {
      await axiosPrivate.post("/api/todos", {
        title,
        description,
        isCompleted,
      });
      navigate("/todos");
    } finally {
      setIsLoading(false);
    }
  };
  const updateItem = async (toDo: Todo) => {
    const id = params.id;
    const { title, description, isCompleted } = toDo;
    setIsLoading(true);
    try {
      await axiosPrivate.put(`/api/todos/${id}`, {
        title,
        description,
        isCompleted,
      });
      navigate("/todos");
    } finally {
      setIsLoading(false);
    }
  };
  const deleteItem = async () => {
    setIsLoading(false);
    try {
      const id = params.id;
      await axiosPrivate.delete(`/api/todos/${id}`);
      navigate("/todos");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.SubmitEvent) => {
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
        className="mx-auto my-16"
      />
      {!isLoading && (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mt-10 rounded-2xl bg-amber-50 p-8 shadow-xl border border-amber-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-amber-950 tracking-tight">
            To Do
          </h2>

          <hr className="border-amber-200" />

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Title
            </span>
            <input
              readOnly={readOnly}
              type="text"
              name="user"
              id="user"
              value={toDo.title}
              className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors"
              onChange={(e) => setToDo({ ...toDo, title: e.target.value })}
            />
            {errors.title && (
              <span className="text-xs font-medium text-red-500">
                {errors.title}
              </span>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Description
            </span>
            <input
              readOnly={readOnly}
              type="text"
              name="description"
              id="description"
              value={toDo.description}
              className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-colors"
              onChange={(e) =>
                setToDo({ ...toDo, description: e.target.value })
              }
            />
          </label>

          <label className="flex items-center gap-3 rounded-lg bg-amber-100 px-4 py-3">
            <input
              disabled={readOnly || method == "POST"}
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              defaultChecked={isCompleted}
              className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              onChange={(e) =>
                setToDo({ ...toDo, isCompleted: e.target.checked })
              }
            />
            <span className="text-sm font-medium text-amber-900">
              Completed
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-700 hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};
export default Item;
