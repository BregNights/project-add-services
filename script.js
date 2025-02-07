import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyCaTr2auup8jwxvCPJSqgBdsf_gsIxF7sw",
    authDomain: "project-add-services.firebaseapp.com",
    projectId: "project-add-services",
    storageBucket: "project-add-services.firebasestorage.app",
    messagingSenderId: "977236101788",
    appId: "1:977236101788:web:6ef57d77eb37833782bb59"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

let selectRequest = 'Cilene'
document.getElementById('selectRequest').addEventListener('change', (event) => {
    selectRequest = event.target.value
})

function addServiceList () {
    const money = parseFloat(document.querySelector('#money').value)
    const service = document.querySelector('#serviceInput').value
    const servicesList = document.querySelector('#serviceList')
    servicesList.innerHTML = `<div class="service">
                                        <span>R$${money.toFixed(2)} - ${selectRequest}</span>
                                        <p>${service}</p>
                                        <div class="serviceBtn">
                                            <button class="edit">✏️</button>
                                            <button class="delete">🗑️</button>
                                        </div>
                                    </div>`
}

async function editDataBase(id, newService) {
    try {
        const serviceData = doc(db, "services", id)
        await updateDoc(serviceData, {
            service: newService
        })
        alert('Serviço atualizado com sucesso!')
    }catch(error) {
        console.log('Erro ao atualizar o serviço:', error)
    }

}

function editFront(serviceElement) {
    const p = serviceElement.querySelector("p")
    const id = serviceElement.getAttribute("data-id")
    const currentService = p.textContent
    const newService = prompt("Edite a descrição do serviço", currentService)

    if(newService !== null) {
        p.textContent = newService.trim()
        editDataBase(id, newService.trim())
    }
}

document.querySelector("#serviceList").addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("edit")) {
        try {
            const serviceElement = event.target.closest('.service')
            editFront(serviceElement)
        }catch (error) {
            console.error("Erro", error)
        }
    }
})

async function deleteDataBase(id) {
    try {
        await deleteDoc(doc(db,"services", id))
    } catch (error) {
        console.error("Erro ao remover o documento do banco de dados:", error)
    }
}

function deleteFront(Service) {
    try {
        Service.remove()
    } catch (error) {
        console.error("Erro ao remover o documento:", error)
    }
}

document.querySelector("#serviceList").addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("delete")) {
        if (confirm('Tem certeza que deseja remover esta linha?')) {
            try {
                const serviceElement = event.target.closest('.service')
                const id = serviceElement.getAttribute("data-id")
        
                deleteFront(serviceElement)
                deleteDataBase(id)
            } catch (error) {
                console.error("Erro ao remover o documento:", error)
            }
        }
        
    }
})

async function saveDataBase () {
    const money = parseFloat(document.getElementById('money').value)
    const service = document.querySelector('#serviceInput').value

    const data = {
        price: money,
        employer: selectRequest,
        service: service,
        timestamp: new Date()
    }

    try {
        await addDoc(collection(db, "services"), data)
        console.log("Serviço salvo com sucesso!")
        alert("Serviço salvo com sucesso!")
    } catch (error) {
        console.error("Erro ao salvar o serviço:", error)
        }
}

async function loadData () {
    const servicesList = document.querySelector('#serviceList')
    servicesList.innerHTML = ""

    try {
    const querySnapshot = await getDocs(collection(db, "services"))
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id
            
            servicesList.innerHTML += `<div class="service" data-id="${id}">
                                        <span>R$${data.price.toFixed(2)} - ${data.employer}</span>
                                        <p>${data.service}</p>
                                        <div class="serviceBtn">
                                            <button class="edit">✏️</button>
                                            <button class="delete">🗑️</button>
                                        </div>
                                    </div>`
        })
    } catch (error) {
        console.error("Erro ao carregar dados:", error)
    }
}

document.getElementById('addserviceBtn').addEventListener('click', () =>{
    const money = parseFloat(document.getElementById('money').value)
    const service = document.querySelector('#serviceInput').value
    try {
        if (!money || service === '') {
            alert('Valor inválido')
            return
        }
        addServiceList()
        saveDataBase()
        loadData()
        document.getElementById('money').value = ''
        document.getElementById('serviceInput').value = ''
    } catch(error) {
        console.error("Erro:", error)
    }
})

document.querySelectorAll('#money, #serviceInput').forEach(input => {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            document.getElementById('addserviceBtn').click()
        }
    })
})

document.addEventListener("DOMContentLoaded", loadData)