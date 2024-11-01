import "./App.css";
import HomePage from "./Pages/Home/HomePage";
import BookSearchh from './Pages/Search/BookSearchh';
import CreateBook from "./Pages/CreateBook/CreateBook";
import BookPage from './Pages/BookPage/BookPage'
import LogInPage from "./Pages/LogIn/LogInPage";
import SignUpPage from "./Pages/SignUp/SignUpPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<BookSearchh />} />
          <Route path='/createbook' element={<CreateBook />} />
          <Route path='/book/:id' element={<BookPage />}/>
          <Route path='/login' element={<LogInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;