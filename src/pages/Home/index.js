import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import './home.css';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const { user, setUser, storageUser, loadingauth, setLoadingAuth } = useContext(AuthContext);
  const navigate = useNavigate(); 

  return (
    <div className="container">
      <Header/>
      <h1>Sherife do Dia - {user.nome}</h1>
    </div>
  );
}
