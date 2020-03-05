class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

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
                    user.photo = content
                    
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
                    this.addLine(user)
                    this.formEl.reset()
                    btn.disable = false
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
                resolve('dist/img/user4-128x128.jpg')
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

    addLine(dataUser){
        var tr = document.createElement("tr")

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = `
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.isAdmin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit-user">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`

        this.addEventsTr(tr)

        this.tableEl.appendChild(tr)

        this.udpateUsersStatistics()
    }

    updateLine(dataUser){
        let index = this.formUpdateEl.dataset.trIndex 
        let tr = this.tableEl.rows[index]

        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML = `
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.isAdmin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit-user">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`

        this.addEventsTr(tr)
        this.udpateUsersStatistics()
    }

    addEventsTr(tr){
        tr.querySelector(".btn-edit-user").addEventListener("click", e => {
            let formUpdate = document.querySelector("#form-user-update")
            let json = JSON.parse(tr.dataset.user)

            formUpdate.dataset.trIndex = tr.sectionRowIndex

            for (let name in json){
                let field
                if(name == "_isAdmin"){
                    field = formUpdate.querySelector("[name='admin']")
                } else {
                    field = formUpdate.querySelector("[name='" + name.replace("_","") + "']")
                }
                                
                if(field){
                    switch(field.type){
                        case "file":
                            break
                        case "checkbox":
                            field.checked = json[name]
                            break
                        case "radio":
                            field = formUpdate.querySelector("[name='" + name.replace("_","") + "'][value='"+json[name]+"']")
                            field.checked = true
                            break
                        default:
                            field.value = json[name]
                    }
                    
                }  
            }

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