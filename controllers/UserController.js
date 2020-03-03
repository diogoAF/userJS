class UserController {

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)
        console.log(typeof this.formEl.elements)
        this.onSubmit()
    }

    onSubmit(){
        
        this.formEl.addEventListener('submit', event => {
            event.preventDefault()

            let user = this.getValues()

            let btn = this.formEl.querySelector("[type='submit']")
            btn.disable = true

            this.getPhoto().then( content => {
                user.photo = content
                this.addLine(user)
                this.formEl.reset()
                btn.disable = false
                },
                (error) => {
                    console.error(error)
                }
            )  
        })
    }

    getPhoto(){

        return new Promise( (resolve, reject) => {
            let fileReader = new FileReader()

            let arrayOfFormElements = [...this.formEl.elements]
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

    getValues(){
        let user = {}
        let arrayOfFormElements = [...this.formEl.elements]

        arrayOfFormElements.forEach((field, index) => {
            if(field.name == 'gender'){
                if(field.checked)
                    user[field.name] = field.value
            } else if(field.name == 'admin') {
                user[field.name] = field.checked
            }else {
                user[field.name] = field.value
            }
        })
    
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

        tr.innerHTML = `
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.isAdmin) ? 'Sim' : 'Não'}</td>
                        <td>${dataUser.register.toLocaleDateString()}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>`
    
            this.tableEl.appendChild(tr)
    }

}