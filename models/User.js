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
				case '_register':
					this[name] = new Date(json[name])
					break
				default:
					this[name] = json[name]
			}
		}
	}

	static getUsersFromStorage(){
        let users = []
        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"))
        }
        return users
	}
	
	delete(){
		let users = User.getUsersFromStorage()

		users.forEach( (user, index) => {
			if(this.id == user._id){
				users.splice(index, 1)
			}
		})
		localStorage.setItem("users", JSON.stringify(users))
	}

	save(){
		let users = User.getUsersFromStorage()
		if(this.id > 0){
			users.map(user => {
				if(user._id == this.id){
					Object.assign(user, this)
				}
				return user
			})
		} else {
			this._id = this.getNewId()
			users.push(this)
		}
		localStorage.setItem("users", JSON.stringify(users))
	}

	getNewId(){
		let lastUsersId = parseInt( localStorage.getItem("lastUsersId") )
		if(!lastUsersId) lastUsersId = 0
		localStorage.setItem("lastUsersId", ++lastUsersId)
		return lastUsersId
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
}