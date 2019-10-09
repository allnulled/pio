import moment from "moment";

export default {
    processCommands: function() {
      if(!Array.isArray(this.commandData)) {
      	throw new Error("Property commandData must be an array");
      }
      this.commandData.forEach(command => {
      	this.processCommand(command);
      });
    },
    processCommand: function(command) {
    	if(typeof command !== "object") {
    		console.log("Command:", command);
    		throw new Error("Every command in commandData must be an object");
    	}
    	switch(command.sentence) {
    		case "create in store":
    			this.createInStore(command);
    			break;
    		case "edit from store":
    			this.editFromStore(command);
    			break;
    		case "delete from store":
    			this.deleteFromStore(command);
    			break;
    		case "search in store":
    			this.searchInStore(command);
    			break;
    		case "execute from store":
    			this.executeFromStore(command);
    			break;
    		default:
    			throw new Error("Sentence not identified");
    	}
    },
	createInStore: function(command) {
		if(!command.item) {
			throw new Error("The id parameter is needed to create an instance");
		}
		if(!(command.store in this.store)) {
			this.store[command.store] = {};
		}
		if(command.item in this.store[command.store]) {
			throw new Error("Instance to create is already defined");
		}
		this.store[command.store][command.item] = Object.assign({}, this.transformAttributes(command.attributes));
		this.searchInStore(command);
	},
	deleteFromStore: function(command) {
		if(!command.item) {
			throw new Error("The id parameter is needed to delete an instance");
		}
		if(!(command.item in this.store[command.store])) {
			throw new Error("Instance to delete is not defined");
		}
		delete this.store[command.store][command.item];
		this.searchInStore(command);
	},
	editFromStore: function(command) {
		if(!command.item) {
			throw new Error("The id parameter is needed to edit an instance");
		}
		if(!(command.item in this.store[command.store])) {
			throw new Error("Instance to edit is not defined");
		}
		this.store[command.store][command.item] = Object.assign({}, this.store[command.store][command.item], this.transformAttributes(command.attributes));
		this.searchInStore({store:command.store,item:command.item});
	},
	searchInStore: function(command) {
		console.log("Command:", command);
		if(command.item === null) {
			// @todo: global search:
			let result = {};
			console.log(1);
			// @todo: superglobal search:
			if(command.store === "*") {
				console.log(2);
				result = this.store;
			}
			// @todo: global search:
			else {
				result = this.store[command.store];
				console.log(3, result, command);
				// @todo: apply wheres:
				// @todo: apply groups:
				if(command.metadata && ("group" in command.metadata)) {
					console.log(4);
					const groupItemsBy = (items, field) => {
						console.log(6);
						const res = {};
						Object.keys(items).sort((a,b) => {
							return (items[a][field] > items[b][field]) ? 1 : -1;
						}).forEach(key => {
							console.log(key);
							const item = items[key];
							if(field in item) {
								if(!(item[field] in res)) {
									res[item[field]] = {};
								}
								res[item[field]][key] = item;
							} else {
								if(!("ungrouped items" in res)) {
									res["ungrouped items"] = {};
								}
								res["ungrouped items"][key] = item;
							}
						});
						return res;
					};
					const groups = command.metadata["group"].split(",");
					console.log(5);
					result = groupItemsBy(result, groups[0]);
					console.log("Result:", result);
				}
				// @todo: apply orders:
			}
			this.commandData = result;
		} else {
			// @todo: local search:
			this.commandData = Object.assign({":id": command.item}, this.store[command.store][command.item]);
		}
	},
	executeFromStore: function(command) {
		if(!("commands" in this.store)) {
			this.store.commands = {};
		}
		if(command.command in this.store.commands) {
			const executable = this.store.commands[command.command];
			if(executable.query) {

			}
			if(executable.script) {
				const evaluation = "((component, command, executable) => {" + executable.script + "})()";
				console.log("Executing:", evaluation);
				eval(evaluation);
			}
		} else {
			this.commandError = new Error("Command not found among: " + Object.keys(this.store.commands).join("\n- "));
		}
	},
	transformAttributes(attributes) {
		return Object.keys(attributes).reduce((result, key) => {
			result[key] = typeof attributes[key] === "string" ? 
				this.transformAttributeValue(attributes[key]) :
				attributes[key];
			return result;
		}, {});
	},
	transformAttributeValue(textInput) {
		let text = textInput;
		const findFirst = (dest) => {
			const d = new Date();
			// @todo: find the first monday and set it
			const curr = d.getDay();
			if(curr === dest) {
				d.setDate(d.getDate() + 7);
			} else if(curr < dest) {
				d.setDate(d.getDate() + (dest-curr));
			} else if(curr > dest) {
				d.setDate(d.getDate() + (7-(curr-dest)));
			}
			return `${d.getFullYear()} ${d.getMonth()+1} ${d.getDate()}`;
		};
		const MOMENT_REGEX = /^([0-9][0-9][0-9][0-9]) ([0-9][0-9]?) ([0-9][0-9]?) ([0-9][0-9]?) ([0-9][0-9]?)$/;
		const standarizeDate = (dateTxt) => {
			const result = dateTxt.split(" ").map(i=>(i.length===1)?("0"+i):i);
			return `${result[0]}/${result[1]}/${result[2]} ${result[3]}:${result[4]}`;

		};
		const TRANSFORMATIONS = {
			"$hoy": () => {
				const d = new Date();
				return `${d.getFullYear()} ${d.getMonth()+1} ${d.getDate()}`;
			},
			"$mañana": () => {
				const d = new Date();
				d.setDate(d.getDate()+1);
				return `${d.getFullYear()} ${d.getMonth()+1} ${d.getDate()}`;
			},
			"$pasadomañana": () => {
				const d = new Date();
				d.setDate(d.getDate()+2);
				return `${d.getFullYear()} ${d.getMonth()+1} ${d.getDate()}`;
			},
			"$lunes": () => {
				return findFirst(1);
			},
			"$martes": () => {
				return findFirst(2);
			},
			"$miércoles": () => {
				return findFirst(3);
			},
			"$miercoles": () => {
				return findFirst(3);
			},
			"$jueves": () => {
				return findFirst(4);
			},
			"$viernes": () => {
				return findFirst(5);
			},
			"$sábado": () => {
				return findFirst(6);
			},
			"$sabado": () => {
				return findFirst(6);
			},
			"$domingo": () => {
				return findFirst(7);
			},
		};
		Object.keys(TRANSFORMATIONS).forEach(transformation => {
			text = text.replace(transformation, TRANSFORMATIONS[transformation]);
		});
		if(text.match(MOMENT_REGEX)) {
			text = standarizeDate(text);
		} else {
		}
		return text;
	}
}