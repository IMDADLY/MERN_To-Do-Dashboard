//import axios from "axios";
//import { Pencil, Check, Plus, X } from "lucide-react";
import { useParams } from "react-router";
function Home() {
  const params = useParams();
  console.log(params);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>john</td>
            <td>33</td>
          </tr>
          <tr>
            <td>smith</td>
            <td>22</td>
          </tr>
          <tr>
            <td>jane</td>
            <td>24</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Home;
