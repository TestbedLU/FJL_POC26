export default class ObjMover {
	constructor(osmb, buildingWalls, buildingRoof, moveHouse){
		this._osmb = osmb;
		this._buildingWalls = buildingWalls;
		this._buildingRoof = buildingRoof;
		this._moveHouse = moveHouse;

		this._mapDiv = document.getElementById('map').firstChild;
		this._isPointerDown = false;
		this._isPointerOffset = {
			lat: 0,
			lng: 0
		};
		this.addEvents();
	}

	isValidTarget(target){
		return target.features && target.features.length === 1 &&
			(target.features[0].id === this._buildingWalls.id || target.features[0].id === this._buildingRoof.id);
	}

	addEvents(){
		this._osmb.events.listeners.pointerdown = undefined;
		this._osmb.events.listeners.pointermove = undefined;
		this._osmb.events.listeners.pointerup = undefined;

		this._osmb.on('pointerdown', xy => {
			const isRotationBtn = xy.button === 2;

			if (isRotationBtn){
				this._mapDiv.style.cursor = 'all-scroll';
			} else {
				this._osmb.view.Picking.getTarget(xy.x, xy.y, target => {
					if (this.isValidTarget(target)) {
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
			}
		});

		this._osmb.on('pointermove', xy => {
			this._osmb.view.Picking.getTarget(xy.x, xy.y, target => {
				if (this.isValidTarget(target)) {
					this._mapDiv.style.cursor = this._isPointerDown
						? 'grabbing'
						: 'grab';
				} else {
					this._mapDiv.style.cursor = 'default';
				}
			});

			if (this._isPointerDown) {
				const latLong = this._osmb.unproject(xy.x, xy.y);

				this._buildingWalls.latitude = latLong.latitude;
				this._buildingWalls.longitude = latLong.longitude;
				this._buildingRoof.latitude = latLong.latitude;
				this._buildingRoof.longitude = latLong.longitude;
			}
		});

		this._osmb.on('pointerup', target => {
			this._isPointerDown = false;
			this._osmb.setDisabled(false);

			if (!('features' in target) || this.isValidTarget(target)) {
				this._mapDiv.style.cursor = 'grab';
			} else {
				this._mapDiv.style.cursor = 'default';
			}

			const {latitude, longitude} = this._buildingWalls;
			if (latitude && longitude) {
				this._moveHouse({latitude, longitude});
			}
		});
	}
}
