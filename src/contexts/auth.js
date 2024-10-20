import {useState, createContext, useEffect} from 'react';
import {auth, db} from '../services/firebaseConection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, query, where, setDoc, collection, getDocs, updateDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

// Função para zerar campos da coleção UsuarioCredFlex
async function resetFlexData() {
    try {
        // Referência para a coleção UsuarioCredFlex
        const usersCollection = collection(db, 'UsuarioCredFlex');
        
        // Obtém todos os documentos da coleção
        const usersSnapshot = await getDocs(usersCollection);
        
        // Itera sobre cada documento e atualiza os campos desejados
        const promises = usersSnapshot.docs.map(async (userDoc) => {
            const userRef = doc(db, 'UsuarioCredFlex', userDoc.id);
            
            // Atualiza os campos para 0 ou valores vazios
            await updateDoc(userRef, {
                historico: [], // Zera o histórico
                saldoFlexoes: 0, // Zera o saldo de flexões
                totalFlexoesPagas: 0 // Zera o total de flexões pagas
            });
        });

        // Espera que todas as operações de atualização sejam concluídas
        await Promise.all(promises);
        
        console.log("Todos os usuários foram atualizados com sucesso.");
    } catch (error) {
        console.error("Erro ao atualizar os usuários:", error);
    }
}

// Função para gerar uma senha aleatória
function generateRandomPassword(length = 10) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Função para popular o banco de dados
async function populateDatabase() {
    const auth = getAuth(); // Instância do Firebase Authentication

    // Verifica se o usuário já existe no banco para evitar duplicatas
    const usersCollection = collection(db, 'UsuarioApp');
    const existingUsersSnapshot = await getDocs(usersCollection);
    const existingEmails = existingUsersSnapshot.docs.map(doc => doc.data().email); // Captura os e-mails já existentes

    // Dados dos novos usuários em português
    const usersToAdd = [
        {
            email: 'admin@example.com',
            nivel: 'Administrador',
            nome: 'Administrador Nome',
            numero: '123456',
            nomedeguerra: 'Admin',
            pelotao: 'N/A',
            isSheriff: false,
        },
        {
            email: 'aluno1@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Um',
            numero: '654321',
            nomedeguerra: 'Guerreiro1',
            pelotao: '5° Pelotão',
            isSheriff: true,
        },
        {
            email: 'aluno2@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Dois',
            numero: '112233',
            nomedeguerra: 'Guerreiro2',
            pelotao: '5° Pelotão',
            isSheriff: false,
        },
        {
            email: 'aluno3@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Três',
            numero: '223344',
            nomedeguerra: 'Guerreiro3',
            pelotao: '6° Pelotão',
            isSheriff: false,
        },
        {
            email: 'aluno4@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Quatro',
            numero: '334455',
            nomedeguerra: 'Guerreiro4',
            pelotao: '6° Pelotão',
            isSheriff: true,
        },
        {
            email: 'aluno5@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Cinco',
            numero: '445566',
            nomedeguerra: 'Guerreiro5',
            pelotao: '7° Pelotão',
            isSheriff: false,
        },
        {
            email: 'aluno6@example.com',
            nivel: 'Aluno',
            nome: 'Aluno Seis',
            numero: '556677',
            nomedeguerra: 'Guerreiro6',
            pelotao: '7° Pelotão',
            isSheriff: true,
        },
    ];

    // Adiciona os novos usuários ao Firestore e Authentication
    for (const user of usersToAdd) {
        if (!existingEmails.includes(user.email)) {
            const password = generateRandomPassword(); // Gera uma senha aleatória

            try {
                // Cria o usuário no Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
                const uid = userCredential.user.uid; // Captura o UID do usuário criado

                // Armazena o usuário no Firestore usando o UID como ID do documento
                await setDoc(doc(usersCollection, uid), { ...user, uid, password }); // Adiciona o UID aos dados do usuário
                console.log(`Usuário ${user.nome} adicionado com sucesso! Email: ${user.email} | Senha: ${password} | UID: ${uid}`);
            } catch (error) {
                console.error(`Erro ao adicionar o usuário ${user.nome}: `, error);
            }
        } else {
            console.log(`Usuário ${user.nome} já existe e não será adicionado.`);
        }
    }
}


  function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingauth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  

    useEffect(()=>{
      async function loadUser(){
        const storageUser = localStorage.getItem('@AuthUsers')
        if(storageUser){
          setUser(JSON.parse(storageUser));
          setLoadingAuth(false);
        }

        setLoadingAuth(false);
      }
      loadUser();
    },[])

    async function signIn(email, password) {
      setLoadingAuth(true);
      try {
        const value = await signInWithEmailAndPassword(auth, email, password);
        const uid = value.user.uid;
        const docRef = doc(db, "UsuarioApp", uid);
        const docSnap = await getDoc(docRef);
    
        const nome = docSnap.data().nome;
        const isSheriff = docSnap.data().isSheriff;
        const nivel = docSnap.data().nivel;
        // populateDatabase();       
        // Chame a função para executar o reset
        // resetFlexData();
    
        let data = {
          uid: uid,
          nome: nome,
          email: value.user.email,
          isSheriff: isSheriff,
          nivel: nivel
        };
    
        setUser(data);
        storageUser(data);
        toast.success("Bem-vindo de volta!");

        navigate("/home");
      } catch (error) {
        console.log(error);
        toast.error("Ops, algo deu errado!");
      } finally {
        setLoadingAuth(false);
      }
    }

    async function signUp(email, password, name, classificacao, cidadeprimeira, cidadesegunda) {
      setLoadingAuth(true);
    
      // Remove apenas o último espaço no final do nome, se houver
      const trimmedName = name.endsWith(' ') ? name.slice(0, -1) : name;
    
      try {
        // Verifica se o nome já está no banco de dados
        const userSnapshot = await getDocs(query(collection(db, "users"), where("nome", "==", trimmedName)));
        if (!userSnapshot.empty) {
          toast.error(`Nome "${trimmedName}" já está cadastrado!`, { className: 'toast-error' });
          setLoadingAuth(false);
          return; // Interrompe o processo de cadastro
        }
    
        const value = await createUserWithEmailAndPassword(auth, email, password);
        const uid = value.user.uid;
    
        await setDoc(doc(db, "users", uid), {
          nome: trimmedName,
          classificacao: classificacao,
          cidadeprimeira: cidadeprimeira,
          cidadesegunda: cidadesegunda,
          avatarUrl: null
        });
    
        let data = {
          uid: uid,
          nome: trimmedName,
          email: value.user.email,
          cidadeprimeira: cidadeprimeira,
          cidadesegunda: cidadesegunda,
          classificacao: classificacao,
          avatarUrl: null
        };
    
        setUser(data);
        storageUser(data);
        toast.success("Seja bem-vindo ao sistema!");
        navigate("/home");
      } catch (error) {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          toast.error("Erro: E-mail já utilizado.", { className: 'toast-error' });
        } else {
          toast.error("Erro: Verifique suas informações!", { className: 'toast-error' });
        }
      } finally {
        setLoadingAuth(false);
      }
    }
    
    function storageUser(data){
      localStorage.setItem('@AuthUsers', JSON.stringify(data));
    }

    async function logout(){
      await signOut(auth);
      localStorage.removeItem('@AuthUsers');
      setUser(null);
    }

    return(
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                setUser,
                storageUser,
                signIn,
                logout,
                setLoadingAuth,
                loadingauth,
                loading,
            }}  
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;