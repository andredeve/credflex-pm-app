import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import './home.css';


export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <Header/>
      <h1>Sherife do Dia - {user.nome}</h1>
    </div>
  );
}
