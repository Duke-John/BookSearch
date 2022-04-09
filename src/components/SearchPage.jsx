import { Link } from "react-router-dom";
import React,{useEffect} from 'react';
import {
  InputGroup,
  Input,

  Button,
  FormGroup,
  Label,
  Spinner
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import BookCard from './BookCard.jsx';
import axios from 'axios';
import {useState} from 'react';
import "./styles.css"
import { useNavigate } from "react-router-dom";
export default function SearchPage() {
  const [maxResults, setMaxResults] = useState(10);
    const [startIndex, setStartIndex] = useState(1);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    // Handle Search
    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
      if (maxResults > 40 || maxResults < 1) {
        toast.error('max results must be between 1 and 40');
      } else {
        axios
          .get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`
          )
          .then(res => {
            if (startIndex >= res.data.totalItems || startIndex < 1) {
              toast.error(
                `max reults must be between 1 and ${res.data.totalItems}`
              );
            } else {
              if (res.data.items.length > 0) {
                setCards(res.data.items);
                setLoading(false);
              }
            }

          })
          .catch(err => {
            setLoading(true);
            console.log(err.response);
          });
          const data=JSON.parse(localStorage.getItem("loginData"));
          data.queries=query;
          axios.post("/api/save-user-data",data);
      }
    };
    const handleLogout = () => {
      localStorage.removeItem("loginData");
      window.href = "/";
      window.location.reload();
    }
    let navigate = useNavigate();
    const routeChange = () =>{
      let path = `/`;
      navigate(path);
    }
    useEffect(() => {
      if(localStorage.getItem("loginData")==null){
        window.location.href="/";
      }
    }, [])
    // Main Show Case
    const mainHeader = () => {
      return (
        <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          Navbar
          <button type="button" class="btn btn-link px-3 me-2" onClick={() => handleLogout()}>Logout</button>
          <button type="button" class="btn btn-link px-3 me-2" onClick={routeChange}>Home</button>
        </nav>

        <div className='main-image d-flex justify-content-center align-items-center flex-column'>
          {/* Overlay */}
          <div className='filter'></div>
          <h1
            className='display-2 text-center text-white mb-3'
            style={{ zIndex: 2 }}
          >
            Google Books
          </h1>
          <div style={{ width: '60%', zIndex: 2 }}>
            <form>
            <InputGroup size='lg' className='mb-3'>
              <Input
                placeholder='Book Search'
                value={query}
                onChange={e => setQuery(e.target.value)}
              />

                <Button type="submit" color='secondary' onClick={handleSubmit}>
                  <i className='fas fa-search'></i>Search
                </Button>

            </InputGroup>
            </form>
            <div className='d-flex text-white justify-content-center'>
              <FormGroup >
                <Label for='maxResults'>Max Results</Label>
                <Input
                  type='number'
                  id='maxResults'
                  placeholder='Max Results'
                  value={maxResults}
                  onChange={e => setMaxResults(e.target.value)}
                />
              </FormGroup>
              <FormGroup className='ml-5'>
                <Label for='startIndex'>Start Index</Label>
                <Input
                  type='number'
                  id='startIndex'
                  placeholder='Start Index'
                  value={startIndex}
                  onChange={e => setStartIndex(e.target.value)}
                />
              </FormGroup>
            </div>
          </div>
        </div>
        </div>
      );
    };

    const handleCards = () => {
      if (loading) {
        return (
          <div className='d-flex justify-content-center mt-3'>
            <Spinner style={{ width: '3rem', height: '3rem' }} />
          </div>
        );
      } else {
        const items = cards.map((item, i) => {
          let thumbnail = '';
          if (item.volumeInfo.imageLinks) {
            thumbnail = item.volumeInfo.imageLinks.thumbnail;
          }

          return (
            <div className='col-lg-4 mb-3' key={item.id}>
              <BookCard
                thumbnail={thumbnail}
                title={item.volumeInfo.title}
                pageCount={item.volumeInfo.pageCount}
                language={item.volumeInfo.language}
                authors={item.volumeInfo.authors}
                publisher={item.volumeInfo.publisher}
                description={item.volumeInfo.description}
                previewLink={item.volumeInfo.previewLink}
                infoLink={item.volumeInfo.infoLink}
              />
            </div>
          );
        });
        return (
          <div className='container my-5'>
            <div className='row'>{items}</div>
          </div>
        );
      }
    };
    return (
      <div className='w-100 h-100'>
        {mainHeader()}
        {handleCards()}
        <ToastContainer />
      </div>
    );
  }
