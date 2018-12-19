
/**
	@author: numchain/qupenghui
	@website: www.numchain.com
	@description: MetaMask interface for ERC20
*/
;(function(window){
		

    var Token = function(config){
 		return new Token.fn.init(config);
    };

    Token.fn = Token.prototype = {
    	constructor : Token,

    	init : function(config){

    		if (typeof web3 !== 'undefined') {
		        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
		        window.web3 = new Web3(web3.currentProvider);
		    } else {
		        console.warn("No web3 detected.");
		    }

			if (typeof config.abi === 'undefined'){
				config.abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"totalSupply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
			}
			if(typeof web3 !== 'undefined'){
				this.contract = !!web3&&web3.eth.contract(config.abi).at(config.contract_address);
			} else {
				alert('为了不影响您的使用，请去google商店安装MetaMask插件')
			}

    		// console.log("version:",web3.version);
    	},
    	getName : function(){
			return new Promise((resolve, reject) => {
		        this.contract.name.call((err, name) => {
		            if(!err){
		            	resolve(name);
		            } else {
		                reject(err);
		            }
		        })
		    });
    	},
    	getSymbol : function(){
			return new Promise((resolve, reject) => {
		        this.contract.symbol((err, symbol) => {
		            if(!err){
		            	resolve(symbol);
		            } else {
		                reject(err);
		            }
		        })
		    });
    	},
    	getTotalSupply: function(){
    		return new Promise((resolve, reject) => {
		        this.contract.totalSupply((err, totalSupply) => {
		            if(!err){
		            	resolve(totalSupply);
		            } else {
		                reject(err);
		            }
		        })
		    });
    	},
    	getDecimals: function(){
    		return new Promise((resolve, reject) => {
		        this.contract.decimals((err, decimals) => {
		            if(!err){
		            	resolve(decimals);
		            } else {
		                reject(err);
		            }
		        })
		    });
    	},
    	getBalanceOf: function(account){
    		return new Promise((resolve, reject) => {
		    	this.contract.balanceOf(account, (err, balance) => {
	                if(!err){
	                    resolve(balance);
	                } else {
	                    reject(err);
	                }
	            })
		    });
    	},

    	getAllowance:function(owner,spender){
    		return new Promise((resolve, reject) => {
		    	this.contract.allowance(owner,spender, (err, amount) => {
	                if(!err){
	                    resolve(amount);
	                } else {
	                    reject(err);
	                }
	            })
		    });
    	},
    	transfer:function (to, amount, decimal) {
			return new Promise((resolve, reject) => {
				// 解决浮点数乘法bug
				let digit = amount.toString().split(".").length === 1? 1: amount.toString().split(".")[1].length
				let value = `${amount * Math.pow(10, decimal+digit)/Math.pow(10, digit)}`
				console.log(value)
				this.contract.transfer(to, value, function(err,txHash){
					if(!err){
						resolve({data:txHash,status:0});
					} else {
						reject(err);
					}
				})
			});
    	},
    	approve:function(spender, amount){
			return new Promise((resolve, reject) => {
    			this.contract.approve(spender, amount, function(err,txHash){
    				if(!err){
	                    resolve(txHash);
	                } else {
	                    reject(err);
	                }
    			});
			});
    	},
    	transferFrom:function(from, to, amount){
			return new Promise((resolve, reject) => {
    			this.contract.transferFrom(from, to, amount, function(err,txHash){
    				if(!err){
	                    resolve(txHash);
	                } else {
	                    reject(err);
	                }
    			});
			});
    	},
    	getTransactionReceipt:function(txHash,callBack){
    		web3.eth.getTransactionReceipt(txHash,callBack);
    	}
    };
 
    Token.fn.init.prototype = Token.fn;

    window.Token = Token;

}(window));
