import "./App.css";
import HomePage from "./Pages/Home/HomePage";
import BookSearchh from './Pages/Search/BookSearchh';
import CreateBook from "./Pages/CreateBook/CreateBook";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<BookSearchh />} />
          <Route path='/createbook' element={<CreateBook />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;