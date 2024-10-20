import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import CredFlexPage from '../pages/CredFlexPage';
import CredFlexAluno from '../pages/CredFlexAlunoPage';
import SignIn from '../pages/SignIn';
import Private from './Private';

function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={ <SignIn/> }/>
            <Route path='/credflexaluno' element={ <CredFlexAluno/> }/>
            <Route path='/home' element={ <Private><Home/></Private>}/>
            <Route path='/credflex' element={ <Private><CredFlexPage/></Private>}/>
        </Routes>
    )
}

export default RoutesApp;