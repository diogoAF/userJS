 
var user = {}
var fields = document.querySelectorAll('#form-user-create [name]')

function addLine(dataUser){
    var tr = document.createElement("tr")
    var currentDate = new Date().toLocaleDateString()
    tr.innerHTML = `<tr>
                        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${currentDate}</td>
                        <td>
                        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    </tr>`

        document.querySelector('#table-users-tbody').appendChild(tr)
}

var submit = document.querySelector('#form-user-create').addEventListener('submit', event => {
    event.preventDefault()

    fields.forEach((field, index) => {
        if(field.name == 'gender' && field.checked){
            user[field.name] = field.value
        } else {
            user[field.name] = field.value
        }
    })

    addLine(user)
})