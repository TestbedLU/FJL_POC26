export default class ObjMover {
	constructor(osmb, buildingWalls, buildingRoof){
		this._osmb = osmb;
		this._buildingWalls = buildingWalls;
		this._buildingRoof = buildingRoof;

		this._mapDiv = document.getElementById('map').firstChild;
		this._isPointerDown = false;
		this._isPointerOffset = {
			lat: 0,
			lng: 0
		};
		this.addEvents();
	}

	addEvents(){
		this._osmb.on('pointerdown', xy => {
			console.log({xy, latLng: this._osmb.unproject(xy.x, xy.y)});
			this._osmb.view.Picking.getTarget(xy.x, xy.y, target => {
				if (target.features && target.features.length === 1) {
					const latLng = this._osmb.unproject(xy.x, xy.y);
					this._isPointerDown = true;
					this._isPointerOffset = {
						lat: latLng.latitude,
						lng: latLng.longitude
					};
					this._osmb.setDisabled(true);
					this._mapDiv.style.cursor = 'grabbing';
				}
			});
		});

		this._osmb.on('pointermove', xy => {
			this._osmb.view.Picking.getTarget(xy.x, xy.y, target => {
				if (target.features && target.features.length === 1) {
					this._mapDiv.style.cursor = this._isPointerDown
						? 'grabbing'
						: 'grab';
				} else {
					this._mapDiv.style.cursor = 'default';
				}
			});

			if (this._isPointerDown) {
				const latLong = this._osmb.unproject(xy.x, xy.y);
				const pos = {

				};
				this._buildingWalls.latitude = latLong.latitude;
				this._buildingWalls.longitude = latLong.longitude;
				this._buildingRoof.latitude = latLong.latitude;
				this._buildingRoof.longitude = latLong.longitude;
			}
		});

		this._osmb.on('pointerup', target => {
			this._isPointerDown = false;
			this._osmb.setDisabled(false);

			if (!('features' in target) || (target.features && target.features.length === 1)) {
				this._mapDiv.style.cursor = 'grab';
			} else {
				this._mapDiv.style.cursor = 'default';
			}
		});
	}
}
