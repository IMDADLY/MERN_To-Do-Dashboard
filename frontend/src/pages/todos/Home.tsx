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
      const response = await axiosPrivate.get("/api/todos");
      setToDoList(response.data.data);
      setIsLoading(false);
    }
    fetchToDoList();
  }, []);
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
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>isCompleted</th>
            </tr>
          </thead>
          <tbody>
            {toDoList.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.isCompleted.toString()}</td>
                  <td>
                    <Pencil
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
                  <td>
                    <Trash2
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
              <td>
                <Plus
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
