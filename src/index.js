import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Brewery extends React.Component {
	constructor(props){
		super(props);
			this.state = {
				allowCheckout: false,
				checkoutCart: 0,  //i can't tell what this state does by the name
				uniqueCheckout: 0,  //this isnt too helpful/descriptive either
				beerInventory: 12,  //this never changes, prob not a state either, just a CONST
				itemsInCart: {},
				storeItemCategory: this.props.beerWarehouse,  //this never changes, does it need to be a state
			}
	}
	
	// can u go over 12 beers?
	addToBasket = (beer) => {
		let updatedItemsInCart = {...this.state.itemsInCart};
		let uniqueCheckout = this.state.uniqueCheckout;
		if (updatedItemsInCart[beer]) {
			updatedItemsInCart[beer]++;
		} else {
			uniqueCheckout++;
			updatedItemsInCart[beer] = 1;
		}
		this.setState({
			itemsInCart: updatedItemsInCart[beer]++,
			allowCheckout: uniqueCheckout >= 4,
			uniqueCheckout: uniqueCheckout,
		});
	};

	// what happens if nothing in cart or uniquecheckout is 0 when attempting to remove
	removeFromBasket = (beer) => {
		let updatedItemsInCart = {...this.state.itemsInCart};
		updatedItemsInCart[beer] = 0;
		this.setState({
			itemsInCart: updatedItemsInCart,
			uniqueCheckout: this.state.uniqueCheckout - 1,
			allowCheckout: this.state.uniqueCheckout > 4,
		});
	};

	checkoutFromBasket = (items) => {
		let count = this.state.checkoutCart;
		for(let itemName in items){
			count += items[itemName];
		}

		this.setState({
			itemsInCart: {},
			uniqueCheckout: 0,
			checkoutCart: count,
		})
	};

	render(){
		return(
			<div>
				<Header checkoutCart={this.state.checkoutCart} />
				<DisplayBasket 
					allowCheckout={this.state.allowCheckout}
					uniqueCheckout={this.state.uniqueCheckout}
					itemsInCart={this.state.itemsInCart} 
				  beerInventory={this.state.beerInventory}
				  removeFromBasket={this.removeFromBasket}
				  checkoutFromBasket={this.checkoutFromBasket}
				  updateCheckoutCart={this.updateCheckoutCart} 
				/>
				<BeerInventory 
			  	storeItemCategory={this.state.storeItemCategory}
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
		const {
			itemsInCart, 
			removeFromBasket, 
			allowCheckout, 
			checkoutFromBasket, 
			itemsInCart, 
			beerInventory, 
			uniqueCheckout,
		} = this.props;
		let currentBasket = Object.keys(itemsInCart).map((beer, quantity) => {  //i dont think quantity is what u think it is, it's an index
			if(itemsInCart[beer] > 0){
				return(
					<div className="drinkCard">
					<span className="removeBtn" onClick={() => removeFromBasket(beer)}>X</span>
						<img src={require("./images/" + beer + ".jpg")} alt={"testImage"}/>
						<span>Qty: {itemsInCart[beer]}</span>
					</div>
				)
			}
		});

		return(
			<div id="displayBasket">
				<div className="brewCompany">
					<span className="title"><b>Sean's Brewing Company</b></span><br />
					<span><b>{beerInventory}</b> beers to choose from!</span>
				</div>
				<div className="selectedItems">
					<span className="condition"><b>Your Cart has {uniqueCheckout} / 4 unique selections</b></span>
						{allowCheckout ? (
								<span className="customButton" onClick={() => checkoutFromBasket(itemsInCart)}>Checkout</span>
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
		//grab the props the same way as prev ious component
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
