import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { StringLiteral } from 'typescript';
import { error } from 'console';

interface Movie {
  Title: string;
  Year: number;
  imdbID: string;
}

enum SortOption {
  Year,
  Title
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentPage, setcurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 

  const fetchMoviesFromService = async (title: string, page: number) => {
    const URL = `https://jsonmock.hackerrank.com/api/movies/search/?Title=${title}&page=${page}&s=${title}`
    const response = await fetch(URL);
    if(!response.ok) {
      throw new Error('boo');
    }
    return response.json();
  }

  const fetchMovies = async (title: string, page: number) => {
    const data: any = await fetchMoviesFromService(title,page );
    setMovies(data.data);
   // console.log('movies' + JSON.stringify(data.data))
    setTotalPages(data.total_pages);
    setcurrentPage(1);
  }

  
  const changePage = (page: number ) => {
    setcurrentPage(page);
  }


  const onSort = useCallback((sortOption: SortOption) => {
    console.log( 'before' + JSON.stringify(movies));
      const sortedMovies = sortOption === SortOption.Year ? 
          [...movies].sort((a,b) =>  a.Year-b.Year) :
          [...movies].sort((a,b) => {  
            return a.Title.localeCompare(b.Title)
          })

      console.log('AFTER' + JSON.stringify(sortedMovies))
      setMovies(sortedMovies);
  },[movies])

  return (
    <div className="container">
      <div className='serachContainer'>
        <div className='sortButtons'>
          <button onClick={() => onSort(SortOption.Year)}> Sort movies by year</button>
          <button onClick={() => onSort(SortOption.Title)}> Sort movies by title</button>
        </div>
        <div className='searchLayer'>
          <input placeholder='Type movie name...' value={currentSearch} onChange={(e) => setCurrentSearch(e.target.value)}></input>
          <button onClick={() => fetchMovies(currentSearch, 1)}> Search </button>
        </div>
      </div>
      <MovieList moviesList={movies} />
      <Pages currentPage={currentPage} totalPages={totalPages} onChange={(page: number) => changePage(page)} />

    </div>
  );
}


export const MovieList: React.FC<{moviesList: Movie[]}> = ({moviesList}) => {
  console.log('render movies')
  return(
    <div className='movie-list'>
    {moviesList.map(movie => {
        return(
          <li key={movie.imdbID}> {movie.Title} <span>{movie.Year} </span></li> 
        )
    })}
    </div>
  )
}

export const Pages: React.FC<{ onChange: any, totalPages: number, currentPage: number}> = ({onChange, totalPages, currentPage}) => {
  console.log('Pages');

  if (!currentPage) return null;
  return (
    <div className='pagesContainer'>
        <button disabled={currentPage===1} onClick={() =>onChange(currentPage-1)}> Prev </button>
        <div> {currentPage}</div>
        <button disabled={currentPage===totalPages} onClick={() => onChange(currentPage+1)}> Next </button>

    </div>
  )
}

export default App;
