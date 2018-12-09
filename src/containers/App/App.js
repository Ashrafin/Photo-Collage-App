import React, { Component } from 'react';
import axios from 'axios';
import Photo from '../../components/Photo/Photo';
import $ from 'jquery';
import Masonry from 'masonry-layout/dist/masonry.pkgd.min.js';
import imagesLoaded from 'imagesloaded';
import API_KEY from '../../key';
import './App.sass';

class App extends Component {
  componentWillMount() {
    // fetch images from pexels via axios
    axios({
      method: 'GET',
      url: `https://api.pexels.com/v1/search?query=nature&per_page=50&page=1`,
      headers: {
        Authorization: API_KEY
      }
    })
    .then(res => {
      this.setState({photos: res.data.photos})
    })
    .catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    $(document).ready(() => {
      // wait for all images to load then initialize the masonry layout
      const gridContainer = document.querySelector('.grid');
      setTimeout(() => {
        let masonryInit;
        imagesLoaded(gridContainer, () => {
          masonryInit = new Masonry(gridContainer, {
            itemSelector: '.grid-item'
          });
          masonryInit.on('layoutComplete', function() {
            // console.log(items.length);
            masonryInit.layout();
          });
          masonryInit.layout();
        });
      }, 400);
    });
  }

  state = {
    photos: [],
    disabled: true,
    text: ''
  }

  // check if input is empty
  checkDisabled = (text) => {
    if (text.length === 0) return true;
    return false;
  }

  // form submit fetch new images
  searchImage = (event) => {
    event.preventDefault();
    axios({
      method: 'GET',
      url: `https://api.pexels.com/v1/search?query=${this.state.text}&per_page=50&page=1`,
      headers: {
        Authorization: API_KEY
      }
    })
    .then(res => {
      this.setState({photos: res.data.photos})
    })
    .catch(error => {
      console.log(error);
    });
    $(document).ready(() => {
      // wait for all images to load then initialize the masonry layout
      const gridContainer = document.querySelector('.grid');
      setTimeout(() => {
        let masonryInit;
        imagesLoaded(gridContainer, () => {
          masonryInit = new Masonry(gridContainer, {
            itemSelector: '.grid-item'
          });
          masonryInit.on('layoutComplete', function(items) {
            console.log(items.length);
          });
          masonryInit.layout();
        });
      }, 400);
    });
  }

  render() {
    return (
      <div className="container-fluid px-0">
        <div className="row m-0 fixed-top bg-white">
          <form onSubmit={this.searchImage} className="col-12 px-2 py-3 text-center">
            <input onChange={event => this.setState({text: event.target.value, disabled: this.checkDisabled(event.target.value)})} className="form-control search-input righteous" type="search" placeholder="Search Images" />
            <button className="btn btn-dark search-btn righteous" disabled={this.state.disabled} type="submit">Search</button>
          </form>
        </div>
        <div style={{paddingTop: '60px'}} className="row m-0">
          <div className="col-12 p-0 grid">
            {this.state.photos.map(photo => (
              <Photo
                key={photo.id}
                mediumImage={photo.src.medium}
                largeImage={photo.src.large}
                url={photo.url}
                photographer={photo.photographer}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
