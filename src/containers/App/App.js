import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Photo from '../../components/Photo/Photo';
import Masonry from 'masonry-layout/dist/masonry.pkgd.min.js';
import imagesLoaded from 'imagesloaded';
import API_KEY from '../../key';
import { TimelineLite, CSSPlugin, gsap } from 'gsap';
import './App.sass';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [text, setText] = useState("");

  // browser issues and warning removed
  gsap.registerPlugin(CSSPlugin);
  gsap.config({
    nullTargetWarn: false
  });

  // refs for elements to animate
  const gridParent = useRef(null);
  const form = useRef(null);
  const subHeader = useRef(null);

  useEffect(() => {
    // after scrolling add a box shadow on element
    window.onscroll = () => {
      let findElem = document.getElementById("navSearch");
      if (window.scrollY > 1) {
        findElem.setAttribute("style", "box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10), 0 1px 10px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.03);transition: all .15s linear;");
      } else {
        findElem.removeAttribute("style");
      }
    }

    // animate the nav items via gsap
    document.querySelector("#navSearch").style.visibility = "visible";
    let tl = new TimelineLite();
    tl.from(form.current, 1, {y: "-30px", opacity: 0, delay: 1, ease: "power3"}, 0.1)
      .from(subHeader.current, 1, {y: "30px", opacity: 0, delay: 1, ease: "power3"}, 0.2);

    // fetch images from pexels via axios
    axios({
      method: "GET",
      url: "https://api.pexels.com/v1/search?query=nature&per_page=50&page=1",
      headers: {
        Authorization: API_KEY
      }
    })
      .then(res => {
        const photos = res.data.photos;
        setPhotos(photos);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // wait for all images to load then initialize the masonry layout
    const gridContainer = document.querySelector(".grid");
    gridContainer.style.visibility = "visible";
    let masonryInit;
    imagesLoaded(gridContainer, () => {
      masonryInit = new Masonry(gridContainer, {
        itemSelector: ".grid-item"
      });
      masonryInit.layout();
    });

    // animate each image via gsap
    let tl = new TimelineLite({onComplete: removeTransform});
    tl.from([gridParent.current.childNodes], 1, {y: "100%", opacity: 0, delay: 1, ease: "power3", stagger: {amount: 2.5}}, 0.2);
  }, [photos]);

  // check if input is empty
  const checkDisabled = text => {
    if (text.length === 0) return true;
    return false;
  };

  // remove the transform property from the style to allow gallery to work
  const removeTransform = () => {
    gridParent.current.childNodes.forEach(node => {
      node.style.transform = "none";
    });
  };

  // form submit fetch new images
  const searchImage = event => {
    event.preventDefault();
    axios({
      method: "GET",
      url: `https://api.pexels.com/v1/search?query=${text}&per_page=50&page=1`,
      headers: {
        Authorization: API_KEY
      }
    })
      .then(res => {
        const photos = res.data.photos;
        setPhotos(photos);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="container-fluid px-0">
      <div id="navSearch" className="row m-0 fixed-top bg-white">
        <form ref={form} onSubmit={searchImage} className="col-12 px-2 py-3 text-center">
          <input
            onChange={e => {
              setText(e.target.value);
              setDisabled(checkDisabled(e.target.value));
            }}
            className="form-control search-input righteous" type="search" placeholder="Search Images" />
          <button className="btn btn-dark search-btn righteous" disabled={disabled} type="submit">Search</button>
        </form>
        <div ref={subHeader} className="col-12 px-2 text-center">
          <p style={{fontSize: ".75rem"}} className="text-muted">Powered by <a href="https://www.pexels.com/">Pexels</a></p>
        </div>
      </div>
      <div style={{paddingTop: "95px"}} className="row m-0">
        <div ref={gridParent} className="col-12 p-0 grid">
          {photos.map(photo => (
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
};

export default App;
