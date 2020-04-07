class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

        this.defaultPhoto = 'dist/img/user4-128x128.jpg'

        this.selectAllUsers()

        this.onSubmit()
        this.onEdit()
    }

    onEdit(){
        let btn = document.querySelector("#box-user-update .btn-cancel")

        btn.addEventListener("click", e => {
            this.showPanelCreate()
        })

        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault()

            let user = this.getValues(this.formUpdateEl)

            if(user) {
                let btn = this.formUpdateEl.querySelector("[type='submit']")
                btn.disable = true

                this.getPhoto(this.formUpdateEl).then( content => {

                    if(content != this.defaultPhoto) user.photo = content
                    
                    this.updateLine(user)
                    this.formUpdateEl.reset()
                    btn.disable = false
                    this.showPanelCreate( )
                    },
                    (error) => {
                        console.error(error)
                    }
                )
            }  
        })
    }

    onSubmit(){
        
        this.formEl.addEventListener('submit', event => {
            event.preventDefault()

            let user = this.getValues(this.formEl)

            if(user) {
                let btn = this.formEl.querySelector("[type='submit']")
                btn.disable = true

                this.getPhoto(this.formEl).then( content => {
                    user.photo = content
                    user.save().then(userObject => {
                        this.addLine(userObject)
                        this.formEl.reset()
                        btn.disable = false
                    });
                    
                    },
                    (error) => {
                        console.error(error)
                    }
                )  
            }
            
        })
    }

    getPhoto(formEl){

        return new Promise( (resolve, reject) => {
            let fileReader = new FileReader()

            let arrayOfFormElements = [...formEl.elements]
            let photos = arrayOfFormElements.filter(item => {
                if (item.name === "photo")
                    return item
            })

            let photo = photos[0].files[0]

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = (e) => {
                reject(e)
            }

            if(photo){
                fileReader.readAsDataURL(photo)
            } else {
                resolve(this.defaultPhoto)
            }
            
        })
        
    }

    getValues(formEl){
        let user = {}
        let arrayOfFormElements = [...formEl.elements]

        let isValid = true

        arrayOfFormElements.forEach((field, index) => {
            if(['name','email'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error')
                isValid = false
                return isValid
            }
            if(field.name == 'gender'){
                if(field.checked)
                    user[field.name] = field.value
            } else if(field.name == 'admin') {
                user[field.name] = field.checked
            }else {
                user[field.name] = field.value
            }
        })

        if(!isValid) return false
    
        return new User(
            user.name,
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
            )

    }

    selectAllUsers(){
        User.getUsersFromStorage().then( data => {
            data.users.forEach(user => {
                let newUser = new User()
                newUser.loadFromJson(user)
                this.addLine(newUser)
            })
        })

        
    }

    getTr(dataUser, tr = null){
        if(tr === null) tr = document.createElement("tr")
        tr.innerHTML = `
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.isAdmin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit-user">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete-user">Excluir</button>
                        </td>`

        this.addEventsTr(tr)

        return tr
    }

    addLine(dataUser){
        let tr = this.getTr(dataUser)

        tr.dataset.user = JSON.stringify(dataUser)

        this.tableEl.appendChild(tr)

        this.udpateUsersStatistics()
    }

    updateLine(dataUser){
        let index = this.formUpdateEl.dataset.trIndex 
        let tr = this.tableEl.rows[index]

        let oldUser = JSON.parse(tr.dataset.user)
        if(!dataUser.photo) dataUser.photo = oldUser._photo
        let newUser = Object.assign({}, oldUser, dataUser)

        tr.dataset.user = JSON.stringify(newUser)

        let user = new User()
        user.loadFromJson(newUser)

        user.save().then(userObject => {
            tr = this.getTr(userObject, tr)

            this.udpateUsersStatistics()
        });
        
    }

    addEventsTr(tr){
        tr.querySelector(".btn-delete-user").addEventListener("click", e => {
            if(confirm("Deseja realmente excluir?")){
                let user = new User()
                user.loadFromJson(JSON.parse(tr.dataset.user))
                user.delete().then(data => {
                    tr.remove()
                    this.udpateUsersStatistics()
                })
            }
        })

        tr.querySelector(".btn-edit-user").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.user)

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            for (let name in json){
                let field
                if(name == "_isAdmin"){
                    field = this.formUpdateEl.querySelector("[name='admin']")
                } else {
                    field = this.formUpdateEl.querySelector("[name='" + name.replace("_","") + "']")
                }
                                
                if(field){
                    switch(field.type){
                        case "file":
                            break
                        case "checkbox":
                            field.checked = json[name]
                            break
                        case "radio":
                            field = this.formUpdateEl.querySelector("[name='" + name.replace("_","") + "'][value='"+json[name]+"']")
                            field.checked = true
                            break
                        default:
                            field.value = json[name]
                    }
                    
                }  
            }
            this.formUpdateEl.querySelector(".photo").src = json._photo

            this.showPanelUpdate()
        })
    }

    udpateUsersStatistics(){
        let numberUsers = 0
        let numberAdmin = 0

        let arrayOfUsersTable = [...this.tableEl.children]
        arrayOfUsersTable.forEach(tr => {
            numberUsers++

            let user = JSON.parse(tr.dataset.user)
            if(user._isAdmin) numberAdmin++

        })

        document.querySelector("#number-users").innerHTML = numberUsers
        document.querySelector("#number-users-admin").innerHTML = numberAdmin
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"
        document.querySelector("#box-user-update").style.display = "none"
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none"
        document.querySelector("#box-user-update").style.display = "block"
    }

}