import React, { useState, useEffect, Fragment } from 'react';
import API from '../../helpers/API.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image'
import Stack from 'react-bootstrap/Stack';
import Ratio from 'react-bootstrap/Ratio';
import CarouselItem from './CarouselItem.jsx';
import SearchBar from './SearchBar.jsx';
import Style from './Style.jsx';
import AddToCart from './AddToCart.jsx';
import Form from 'react-bootstrap/Form';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './product-detail.css'

export default function ProductDetail({ product, setProduct }) {

  const [state, setState] = useState({
    currentProduct: product,
    styles: [],
    currentStyle: {},
    currentStyleID: '',
    currentStylePhotos: [],
    currentSku: '',
    currentSize: '',
    currentQuantity: [1]
  })

  useEffect(() => {
    API.GET_PRODUCT_STYLES(product.id)
      .then((response) => {
        setState({
          ...state,
          currentProduct: product,
          styles: response.data.results,
          currentStyle: response.data.results[0],
          currentStyleId: response.data.results[0].style_id,
          currentStylePhotos: response.data.results[0].photos,
          currentPhoto: response.data.results[0].photos[0].url
        })
      })
  }, [product])

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  let handleThumbnailClick = (evt) => {
    setIndex(Number(evt.currentTarget.getAttribute('data-index')));
  }

  const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];

  return (
    <Container fluid>

      <Row>
        <Col><h1>logo</h1></Col>
        <Col><SearchBar /></Col>
      </Row>

      <Row>
        <h5 style={{textAlign: 'center'}}>SITE-WIDE ANNOUNCEMENT MESSAGE! -- SALE / DISCOUNT OFFER -- NEW PRODUCT HIGHLIGHT</h5>
      </Row>

      <Row>

        <Col xs={8}>
          <div height='200px'>
            <ImageGallery items={state.currentStylePhotos.map(({thumbnail_url, url}) => ({
              original: url,
              thumbnail: thumbnail_url
            }))} thumbnailPosition='left'/>
          </div>
        </Col>

        <Col xs={4}>
          <Stack direction='horizontal' gap={1}>
            <i className="bi bi-star"></i>
            <i className="bi bi-star"></i>
            <i className="bi bi-star"></i>
            <i className="bi bi-star"></i>
            <i className="bi bi-star"></i>
          </Stack>
          <br></br>
          <h3>{state.currentProduct.category}</h3>
          <h2>{state.currentProduct.name}</h2>
          {state.currentStyle.sale_price ? <p>${state.currentStyle.sale_price} <s style={{color: 'red'}}>${state.currentStyle.original_price}</s></p> : <p>${state.currentStyle.original_price}</p>}
          {state.currentProduct.slogan && <h4>{state.currentProduct.slogan}</h4>}
          <p>STYLE {'>'} {state.currentStyle.name}</p>
          <Row>
            {state.styles.map((oneStyle, index) => {
              return (
                <Style oneStyle={oneStyle} index={index} state={state} setState={setState}/>
              )
            })}
          </Row>

          <Form id='cartForm'>
            {(Object.keys(state.currentStyle).length !== 0) && <AddToCart state={state} setState={setState}/>}
          </Form>

        </Col>

      </Row>
      <p></p>
    </Container>

  )
};

