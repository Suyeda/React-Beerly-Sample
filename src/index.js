import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Brewery extends React.Component {
	constructor(props){
		super(props);
			this.state = {
				allowCheckout: false,
				checkoutCart: 0,
				uniqueCheckout: 0,
				beerInventory: 12,
				itemsInCart: {},
				storeItemCategory: this.props.beerWarehouse,
			}
	}

	addToBasket = (beer) => {
		let lastState = {...this.state.itemsInCart};
		let lastCheck = this.state.uniqueCheckout;
		let currentBeer = this.state.itemsInCart[beer];

		if(currentBeer === undefined || currentBeer === 0){
			lastState[beer] = 1;
			lastCheck += 1;
		}
		else {
			lastState[beer] += 1;
		}
		this.setState({
			itemsInCart: lastState,
			uniqueCheckout: lastCheck
		});

		if(lastCheck >= 4){
			this.setState({
				allowCheckout: true,
			})
		}

	};

	removeFromBasket = (beer) => {
		let lastState = {...this.state.itemsInCart};
		let lastCheck = this.state.uniqueCheckout;
		lastCheck -= 1;

		lastState[beer] = 0;
		this.setState({
			itemsInCart: lastState,
			uniqueCheckout: lastCheck,
		});

		if(lastCheck < 4){
			this.setState({
				allowCheckout: false,
			})
		}

	};

	checkoutFromBasket = (items) => {
		let newState = {};
		let count = this.state.checkoutCart;
		for(let item in items){
			count += items[item];
		}

		this.setState({
			itemsInCart: newState,
			uniqueCheckout: 0,
			checkoutCart: count,
		})
	};

	render(){
		return(
			<div>
				<Header checkoutCart={this.state.checkoutCart} />
				<DisplayBasket allowCheckout={this.state.allowCheckout}
							   uniqueCheckout={this.state.uniqueCheckout}
							   itemsInCart={this.state.itemsInCart} 
				               beerInventory={this.state.beerInventory}
				               removeFromBasket={this.removeFromBasket}
				               checkoutFromBasket={this.checkoutFromBasket}
				               updateCheckoutCart={this.updateCheckoutCart} />
				<BeerInventory storeItemCategory={this.state.storeItemCategory}
							   addToBasket={this.addToBasket} />
			</div>
		)
	}
}

class Header extends React.Component {
	render(){
		return(
			<div>
				<div id="header">
					<div className="companyName">
						<h1>Beer.ly</h1>
					</div>
					<div className="cartSection">
						<img src={require("./images/cart.png")} alt={"testImage"}/>
						<div className="circle">
							<span><b>{this.props.checkoutCart}</b></span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class DisplayBasket extends React.Component {

	render(){	
		let itemsInCart = this.props.itemsInCart;
		let currentBasket = Object.keys(itemsInCart).map((beer, quantity) => {
			if(itemsInCart[beer] > 0){
				return(
					<div className="drinkCard">
					<span className="removeBtn" onClick={() => this.props.removeFromBasket(beer)}>X</span>
						<img src={require("./images/" + beer + ".jpg")} alt={"testImage"}/>
						<span>Qty: {itemsInCart[beer]}</span>
					</div>
				)
			}
		});

		let checkBtn = null;
		if(this.props.allowCheckout === true){
			checkBtn = <span className="customButton" onClick={() => this.props.checkoutFromBasket(this.props.itemsInCart)}>Checkout</span>
		}
		else {
			checkBtn = <div />
		}

		return(
			<div id="displayBasket">
				<div className="brewCompany">
					<span className="title"><b>Sean's Brewing Company</b></span><br />
					<span><b>{this.props.beerInventory}</b> beers to choose from!</span>
				</div>
				<div className="selectedItems">
					<span className="condition"><b>Your Cart has {this.props.uniqueCheckout} / 4 unique selections</b></span>
						{checkBtn}
					<div className="tempCart">
						{currentBasket}
					</div>
				</div>
			</div>
		)

	}
}

class BeerInventory extends React.Component {

	render(){
		const itemList = this.props.storeItemCategory;
		let beerSection = Object.keys(itemList).map((beerTypes, index) => {
			let currentType = itemList[beerTypes];
			return(
				<div key={index} className="categoryRow">
				<h1>{beerTypes}</h1>
				{
					currentType.map((beer) => {

						return (
							<div key={beer} className="beerCard">
								<img src={require("./images/" + beer + ".jpg")} alt={"testImage"}/>
								<span className="addToCartBtn" onClick={() => this.props.addToBasket(beer.toString())}>Add to Cart!</span>
							</div>
						)
					})
				}
				</div>
			)	
		});

		return(
			<div id="beerSelection">
				<div>{beerSection}</div>
			</div>
		)
	}
}



// ========================================

let beerWarehouse = {
	Mugs : ["Mugs1", "Mugs2", "Mugs3"],
	Pilsners : ["Pilsners1", "Pilsners2", "Pilsners3"],
	Pints : ["Pints1", "Pints2", "Pints3"],
	Stemmed : ["Stemmed1", "Stemmed2", "Stemmed3"]
}

ReactDOM.render(
  <Brewery beerWarehouse={beerWarehouse} />,
  document.getElementById('root')
);
