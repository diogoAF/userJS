class User {
	constructor(name, gender, birth, country, email, password, photo, isAdmin = false){
		this._id
		this._name = name
		this._gender = gender
		this._birth = birth
		this._country = country
		this._email = email
		this._password = password
		this._photo = photo
		this._isAdmin = isAdmin
		this._register = new Date()
	}

	loadFromJson(json){
		for(let name in json){
			switch(name){
				case 'register':
				case '_register':
					this[name] = new Date(json[name])
					break
				default:
					this[name] = json[name]
			}
		}
	}

	static getUsersFromStorage(){
        return HttpRequest.get('/users')
	}
	
	delete(){
		return HttpRequest.delete(`/users/${this.id}`);
	}

	save(){

		return new Promise((resolve, reject) => {
			let promise;
			if(this.id){
				promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());
			} else {
				promise = HttpRequest.post(`/users/`, this.toJSON());
			}

			promise.then(data => {
				this.loadFromJson(data);
				resolve(this);
			}).catch(e=>{
				reject(e);
			});
		});
	}

	toJSON(){
		let json = {};
		Object.keys(this).forEach(key => {
			if(this[key] !== undefined) json[key.replace('_','')] = this[key];
		});
		return json
	}

	// GETTERS
	get id() {
		return this._id
	}
	get name() {
		return this._name
	}
	get gender() {
		return this._gender
	}
	get birth() {
		return this._birth
	}
	get country() {
		return this._country
	}
	get email() {
		return this._email
	}
	get password() {
		return this._password
	}
	get photo() {
		return this._photo
	}
	get isAdmin() {
		return this._isAdmin
	}
	get register(){
		return this._register
	}

	//SETTERS
	set id(value){
		this._id = value
	}
	set name(value){
		this._name = value
	}
	set gender(value){
		this._gender = value
	}
	set birth(value){
		this._birth = value
	}
	set country(value){
		this._country = value
	}
	set email(value){
		this._email = value
	}
	set password(value){
		this._password = value
	}
	set photo(value){
		this._photo = value
	}
	set isAdmin(value){
		this._isAdmin = value
	}
	set register(value){
		this._register = value
	}
}