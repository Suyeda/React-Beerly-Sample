import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Brewery extends React.Component {
	constructor(props){
		super(props);
			this.state = {
				allowCheckout: false,
				itemsInCart: 0,
				uniqueItemsInBasket: 0,
				itemsInBasket: {},
			}
	}

	addToBasket = (beer) => {
		let updatedItemsInCart = {...this.state.itemsInBasket};
		let uniqueCheck = this.state.uniqueItemsInBasket;
		
		if(updatedItemsInCart[beer]){
			updatedItemsInCart[beer]++
		}
		else{
			uniqueCheck++;
			updatedItemsInCart[beer] = 1;
		}

		this.setState({
			itemsInBasket: updatedItemsInCart,
			uniqueItemsInBasket: uniqueCheck,
			allowCheckout: uniqueCheck >= 4
		});
	};

	removeFromBasket = (beer) => {
		let updatedItemsInCart = {...this.state.itemsInBasket};
		let uniqueCheck = this.state.uniqueCheck;
		updatedItemsInCart[beer] = 0;

		this.setState({
			itemsInBasket: updatedItemsInCart,
			uniqueItemsInBasket: uniqueCheck - 1,
			allowCheckout: uniqueCheck >= 4,
		});
	};

	checkoutFromBasket = (items) => {
		let count = this.state.itemsInCart;
		for(let itemName in items){
			count += items[itemName];
		}

		this.setState({
			allowCheckout: false,
			itemsInBasket: {},
			uniqueItemsInBasket: 0,
			itemsInCart: count,
		})
	};

	render(){
		const storeItems = this.props.beerWarehouse;
		return(
			<div>
				<Header itemsInCart={this.state.itemsInCart} />
				<DisplayBasket 
					allowCheckout={this.state.allowCheckout}
					uniqueItemsInBasket={this.state.uniqueItemsInBasket}
					itemsInBasket={this.state.itemsInBasket}
				    removeFromBasket={this.removeFromBasket}
				    checkoutFromBasket={this.checkoutFromBasket}
				/>
				<BeerInventory 
					storeItems={storeItems}
					addToBasket={this.addToBasket} 
				/>
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
							<span><b>{this.props.itemsInCart}</b></span>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class DisplayBasket extends React.Component {

	render(){
		const {
			allowCheckout,
			uniqueItemsInBasket,
			itemsInBasket,
			removeFromBasket,
			checkoutFromBasket,
		} = this.props;	
		let currentBasket = Object.keys(itemsInBasket).map((beer, quantity) => {
			if(itemsInBasket[beer] > 0){
				return(
					<div className="drinkCard">
					<span className="removeBtn" onClick={() => removeFromBasket(beer)}>X</span>
						<img src={require("./images/" + beer + ".jpg")} alt={"testImage"}/>
						<span>Qty: {itemsInBasket[beer]}</span>
					</div>
				)
			}
		});

		// let checkBtn = null;
		// if(allowCheckout === true){
		// 	checkBtn = <span className="customButton" onClick={() => checkoutFromBasket(itemsInBasket)}>Checkout</span>
		// }
		// else {
		// 	checkBtn = <div />
		// }

		return(
			<div id="displayBasket">
				<div className="brewCompany">
					<span className="title"><b>Sean's Brewing Company</b></span><br />
					<span><b>12</b> beers to choose from!</span>
				</div>
				<div className="selectedItems">
					<span className="condition"><b>Your Cart has {uniqueItemsInBasket} / 4 unique selections</b></span>
						{allowCheckout ? (<span className="customButton" onClick={() => checkoutFromBasket(itemsInBasket)}>Checkout</span>
							) : <div />
						}
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
		const itemList = this.props.storeItems;
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
