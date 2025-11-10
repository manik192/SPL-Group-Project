import React, { Component } from 'react';
import axios from 'axios';

class BuildYouritem extends Component {
  constructor() {
    super();
    this.state = {
      ingredients: [],
      bases: [
        { name: 'Gluten-Free', price: 7.5 },
        { name: 'Thick Base', price: 6.5 },
        { name: 'Thin Style', price: 5.0 },
      ],
      selectedBaseIndex: -1,        // start at -1 so validation is clear
      selectedIngredients: [],
      total: 0,
    };
  }

  handleIngredientSelection = (index) => {
    const updatedSelected = [...this.state.selectedIngredients];
    updatedSelected[index] = !updatedSelected[index];

    const toppingsTotal = updatedSelected.reduce((sum, isSelected, idx) => {
      const ing = this.state.ingredients[idx];
      const price = Number(ing?.price || 0);
      return isSelected ? sum + price : sum;
    }, 0);

    const baseTotal =
      this.state.selectedBaseIndex !== null && this.state.selectedBaseIndex !== -1
        ? Number(this.state.bases[this.state.selectedBaseIndex].price || 0)
        : 0;

    this.setState({
      selectedIngredients: updatedSelected,
      total: toppingsTotal + baseTotal,
    });
  };

  handleBaseSelection = (index) => {
    const baseTotal = index !== -1 ? Number(this.state.bases[index].price || 0) : 0;

    const toppingsTotal =
      index !== -1
        ? this.state.selectedIngredients.reduce((sum, isSelected, idx) => {
            const ing = this.state.ingredients[idx];
            const price = Number(ing?.price || 0);
            return isSelected ? sum + price : sum;
          }, 0)
        : 0;

    this.setState({
      selectedBaseIndex: index,
      total: baseTotal + toppingsTotal,
    });
  };

  handleBuilditem = async () => {
    const { selectedBaseIndex, bases, selectedIngredients, ingredients } = this.state;

    if (selectedBaseIndex === null || selectedBaseIndex === -1) {
      alert('Please select a base for your item!');
      return;
    }

    // Base line item
    const base = {
      Name: bases[selectedBaseIndex].name,
      Image:
        'https://media.istockphoto.com/id/1227621205/photo/pizza-dough-isolated-on-white-background-cooking-process-step-by-step-top-view.jpg',
      Price: Number(bases[selectedBaseIndex].price || 0),
      Quantity: 1,
    };

    // Selected toppings as individual line items
    const selectedToppings = selectedIngredients
      .map((isSelected, idx) => {
        if (!isSelected) return null;
        const ingredient = ingredients[idx] || {};
        return {
          Name: ingredient.tname || 'Topping',
          Image: ingredient.image || ingredient.Image || '',
          Price: Number(ingredient.price || 0),
          Quantity: 1,
        };
      })
      .filter(Boolean);

    const payload = [base, ...selectedToppings];

    try {
      const res = await axios.post('http://localhost:8080/build', payload);
      // success contract: either { ok: true } or 200 with no error
      if (res?.data?.ok || res?.status === 200) {
        this.props.history.push('/Cart');
      } else {
        console.error('Build API response:', res?.data);
        alert('Failed to build item.');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err.message ||
        'Unknown error';
      console.error('Error building item:', err?.response?.data || err);
      alert(`Failed to build item: ${msg}`);
    }
  };

  componentDidMount() {
    axios
      .get('http://localhost:8080/getingredients')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        this.setState({
          ingredients: data,
          selectedIngredients: Array(data.length).fill(false),
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    const { bases, selectedBaseIndex, ingredients, selectedIngredients, total } = this.state;

    return (
      <div className="py-4">
        {/* Heading */}
        <div className="row mb-4 mt-2">
          <div className="col text-center">
            <h3 className="fw-bold text">Build Your Meal</h3>
            <p className="text-muted">
              Customize your meal by choosing ingredients from the list below
            </p>
            <hr className="w-25 mx-auto" />
          </div>
        </div>

        {/* Base selector */}
        <h5 className="container fw-bold text-success text mb-4">Choose Your Item Base</h5>
        <div className="container mb-5">
          <div className="row justify-content-center">
            <div className="col-12 mx-2">
              <div className="input-group shadow-sm rounded border p-2">
                <select
                  className="form-select border-0"
                  id="baseSelect"
                  value={selectedBaseIndex}
                  onChange={(e) => this.handleBaseSelection(parseInt(e.target.value))}
                >
                  <option value="-1">-- Select a Base --</option>
                  {bases.map((base, index) => (
                    <option key={index} value={index}>
                      {base.name} (+${Number(base.price).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients grid */}
        <h5 className="container fw-bold text-success text mb-4">Select Toppings</h5>
        <div className="container">
          <div className="row">
            {ingredients.map((ingredient, index) => (
              <div className="col-md-3 mb-4" key={index}>
                <div
                  className={`card h-80 shadow-sm ${
                    selectedIngredients[index] ? 'border-success' : ''
                  }`}
                >
                  <img
                    src={ingredient.image || ingredient.Image || ''}
                    alt={ingredient.tname || 'Ingredient'}
                    className="card-img-top"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{ingredient.tname || 'Ingredient'}</h5>
                    <p className="card-text text-muted mb-2">
                      Price: ${Number(ingredient.price || 0).toFixed(2)}
                    </p>
                    <div className="form-check text-start">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`ingredient-${index}`}
                        checked={!!selectedIngredients[index]}
                        onChange={() => this.handleIngredientSelection(index)}
                      />
                      <label className="form-check-label" htmlFor={`ingredient-${index}`}>
                        Add to item
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total & CTA */}
        <div className="row mt-4 justify-content-center">
          <div className="col-md-6 d-flex justify-content-between align-items-center">
            <h5>
              Total: <span className="text-primary">${Number(total).toFixed(2)}</span>
            </h5>
            <button className="btn btn-success" onClick={this.handleBuilditem}>
              Build Your item
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BuildYouritem;
