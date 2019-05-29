export default class BuildingAttributes{
	constructor(attributes){
		this.attributes = attributes || [];
	}

	getAttributes(model){
		return this.attributes.find(attr => attr.husModell === model);
	}
}