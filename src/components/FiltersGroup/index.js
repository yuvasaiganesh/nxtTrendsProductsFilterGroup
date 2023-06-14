import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    clearFilters,
    toChangeSearchValue,
    toEnterSearchValue,
    searchInput,
  } = props

  const clearDataFromFilter = () => {
    clearFilters()
  }

  const toChangeSearch = event => {
    toChangeSearchValue(event.target.value)
  }

  const toEnterValue = event => {
    if (event.key === 'Enter') {
      toEnterSearchValue()
    }
  }

  const renderCategoriesList = () => {
    const {categoryList} = props

    return categoryList.map(category => {
      const {toChangeCategory, isCategoryValue} = props
      const onClickCategoryItem = () => toChangeCategory(category.categoryId)
      const isActive = category.categoryId === isCategoryValue
      const categoryClassName = isActive
        ? `category-name active-category-name`
        : `category-name`

      return (
        <li
          className="category-item"
          key={category.categoryId}
          onClick={onClickCategoryItem}
        >
          <p className={categoryClassName}>{category.name}</p>
        </li>
      )
    })
  }

  const renderProductCategories = () => (
    <>
      <h1 className="category-heading">Category</h1>
      <ul className="categories-list">{renderCategoriesList()}</ul>
    </>
  )

  const renderRatingsFiltersList = () => {
    const {ratings} = props

    return ratings.map(rating => {
      const {toChangeRating, isRatingValue} = props
      const onClickRatingItem = () => toChangeRating(rating.ratingId)

      const ratingClassName =
        isRatingValue === rating.ratingId ? `and-up active-rating` : `and-up`

      return (
        <li
          className="rating-item"
          key={rating.ratingId}
          onClick={onClickRatingItem}
        >
          <img
            src={rating.imageUrl}
            alt={`rating ${rating.ratingId}`}
            className="rating-img"
          />
          <p className={ratingClassName}>& up</p>
        </li>
      )
    })
  }

  const renderRatingsFilters = () => (
    <div>
      <h1 className="rating-heading">Rating</h1>
      <ul className="ratings-list">{renderRatingsFiltersList()}</ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={toChangeSearch}
          onKeyDown={toEnterValue}
        />
        <BsSearch className="search-icon" />
      </div>

      {renderProductCategories()}
      {renderRatingsFilters()}

      <button
        type="button"
        className="clear-filters-btn"
        onClick={clearDataFromFilter}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
