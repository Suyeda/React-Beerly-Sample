import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class FilterableProductTable extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			checked: false,
			filterText: ''
		};
	}

	boxChecker = () => {
  	  this.setState({checked: !this.state.checked});
	};

	inputChecker = (filterStr) => {
		this.setState({filterText: filterStr});
	};

	render(){
		return(
			<div>
				<SearchBar checkBox={this.boxChecker} inputCheck={this.inputChecker} />
				<br />
				<ProductTable 
					filterText={this.state.filterText}
				 	isChecked={this.state.checked} 
					itemData={this.props.itemData} 
				/>
			</div>
		)
	}
}

class SearchBar extends React.Component {
	handleChange = () => {
		this.props.checkBox();
	};

	updateSearch = (event) => {
		this.props.inputCheck(event.target.value)
	}

	render(){
		return(
			<div>
				<input type="search" onChange={this.updateSearch}></input>
				<br />
				<input type="checkbox" onChange={this.handleChange}></input>
				<label>Only show products in stock</label>
			</div>
		)
	}
}

class ProductTable extends React.Component {
	render(){
		const row1 = [], //make better names what do the rows represent
		row2 = [];
		let storeItems = this.props.itemData;

		for(let i=0; i<storeItems.length; i++){
			if(storeItems[i].category === "Sporting Goods"){
				row1.push(storeItems[i]);
			}
			else{
				row2.push(storeItems[i]);
			}
		}

		return(
			<table>
				<tbody>
					<tr>
						<td>Name</td>
						<td>Price</td>
					</tr>
					<tr>
						<ProductCategoryRow rowHead="Sporting Goods" isChecked={this.props.isChecked} 
						storeItems={row1}></ProductCategoryRow>
					</tr>
					<tr>
						<ProductCategoryRow rowHead="Electronics" isChecked={this.props.isChecked} 
						storeItems={row2}></ProductCategoryRow>
					</tr>
				</tbody>
			</table>
		)
	}
}

class ProductCategoryRow extends React.Component {
	render() {
		const rowHeader = this.props.rowHead, // don't always have to set it to a variable, can just directly use it in component
		storeItems = this.props.storeItems;
		return(
			<div>
				<td>
					<b>{this.props.rowHead}</b>
				</td>
				<ProductRow isChecked={this.props.isChecked} shopItems={storeItems} />
			</div>
		)
		
	}
}

class ProductRow extends React.Component {
	render() {
		const resources = this.props.shopItems;
		const singleData = resources.map((item) => {
			return this.props.isChecked && !item.stocked
				? <div />
				: (
					<div>
						<td key={item.price}>{item.name}</td>
						<td>{item.price}</td>
					</div>
				);
			})
		
		return(
			<div>
				{singleData}
			</div>
		)
	}
}


const facebookData = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

ReactDOM.render(
	<FilterableProductTable itemData={facebookData} />,
	document.getElementById('root')
)
