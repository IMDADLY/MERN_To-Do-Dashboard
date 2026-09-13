import { useNavigate } from "react-router";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Radio } from "react-loader-spinner";
import axiosPrivate from "../../api/axiosPrivate";

type Todos = {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};
const Home = () => {
  const navigate = useNavigate();
  const [toDoList, setToDoList] = useState<Todos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchToDoList() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/api/todos");
        setToDoList(response.data.data);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchToDoList();
  }, []);
  return (
    <>
      <Radio
        visible={isLoading}
        height="50"
        width="50"
        colors={["#d97706", "#d97706", "#d97706"]}
        ariaLabel="radio-loading"
        wrapperClass="mx-auto my-16"
      />

      {!isLoading && (
        <table className="w-full max-w-5xl mx-auto mt-10 overflow-hidden rounded-2xl bg-amber-50 shadow-xl border border-amber-200">
          <thead className="bg-amber-100 border-b border-amber-200">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-amber-900">
                Title
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-amber-900">
                Description
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-amber-900">
                Status
              </th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-amber-200">
            {toDoList.map((item) => {
              return (
                <tr
                  key={item._id}
                  className="hover:bg-amber-100/60 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-amber-950">
                    {item.title}
                  </td>

                  <td className="px-6 py-4 text-amber-800">
                    {item.description}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                        item.isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-200 text-amber-800"
                      }`}
                    >
                      {item.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Pencil
                      className="h-5 w-5 cursor-pointer text-amber-600 hover:text-amber-800 hover:scale-110 transition-all duration-200"
                      onClick={() =>
                        navigate(
                          { pathname: `${item._id}` },
                          {
                            state: {
                              ...item,
                              method: "UPDATE",
                            },
                          },
                        )
                      }
                    />
                  </td>

                  <td className="px-6 py-4">
                    <Trash2
                      className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                      onClick={() =>
                        navigate(
                          { pathname: `${item._id}` },
                          { state: { ...item, method: "DELETE" } },
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}

            <tr>
              <td colSpan={5} className="py-6 text-center bg-amber-50">
                <Plus
                  className="mx-auto h-7 w-7 cursor-pointer rounded-full bg-amber-600 p-1.5 text-white shadow-md hover:bg-amber-700 hover:scale-105 transition-all duration-200"
                  onClick={() =>
                    navigate(
                      { pathname: "add" },
                      {
                        state: {
                          _id: "",
                          title: "",
                          description: "",
                          isCompleted: false,
                          method: "POST",
                        },
                      },
                    )
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};
export default Home;
