import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: '',
    activeOptionId: sortbyOptions[0].optionId,
    ratingValue: '',
    categoryValue: '',
    titleValue: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: '',
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, ratingValue, categoryValue, titleValue} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryValue}&title_search=${titleValue}&rating=${ratingValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: 'success',
      })
    } else {
      this.setState({isLoading: 'failed'})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeRating = option => {
    this.setState({ratingValue: option}, this.getProducts)
  }

  changeCategory = option => {
    this.setState({categoryValue: option}, this.getProducts)
  }

  toClearFilters = () => {
    this.setState(
      {
        ratingValue: '',
        categoryValue: '',
        titleValue: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  toChangeSearchItem = event => {
    this.setState({titleValue: event}, this.getProducts)
  }

  toEnterItem = () => {
    this.getProducts()
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length < 1) {
      return (
        <div className="all-products-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="noProductsView"
          />
          <h1>No products found.</h1>
          <p>We couldnot found any Results</p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />

        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  failureView = () => (
    <div className="all-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failureView"
      />
      <p className="failureParagraph">Oops! Something went wrong</p>
      <p className="failureParagraph">please try again</p>
    </div>
  )

  toRenderAll = () => {
    const {isLoading} = this.state
    switch (isLoading) {
      case 'success':
        return this.renderProductsList()
      case 'failed':
        return this.failureView()
      default:
        return this.renderLoader()
    }
  }

  render() {
    const {titleValue, categoryValue, ratingValue} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryList={categoryOptions}
          ratings={ratingsList}
          toChangeRating={this.changeRating}
          toChangeCategory={this.changeCategory}
          clearFilters={this.toClearFilters}
          toChangeSearchValue={this.toChangeSearchItem}
          toEnterSearchValue={this.toEnterItem}
          searchInput={titleValue}
          isCategoryValue={categoryValue}
          isRatingValue={ratingValue}
        />
        {this.toRenderAll()}
      </div>
    )
  }
}

export default AllProductsSection
